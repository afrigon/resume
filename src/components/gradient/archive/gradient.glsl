#version 300 es
precision highp float;

uniform float time;
uniform vec2 resolution;

out vec4 output_color;

float gaussian(vec2 p, float radius) {
    // exp falloff for very soft blobs
    float d = dot(p, p);
    return exp(-d / (2.0 * radius * radius));
}

// smooth palette blend using barycentric weights
vec3 blendPalette(float w0, float w1, float w2, float w3) {
    vec3 palette[4] = vec3[4](
        vec3(1, 0.2, 0.4), 
        vec3(1, 0.7647058823529411, 0.30196078431372547), 
        vec3(0.4980392156862745, 0.8392156862745098, 1), 
        vec3(0.5411764705882353, 0.3568627450980392, 1)
    );

    float sum = w0 + w1 + w2 + w3 + 1e-5;
    w0 /= sum; w1 /= sum; w2 /= sum; w3 /= sum;
    return palette[0] * w0 + palette[1] * w1 + palette[2] * w2 + palette[3] * w3;
}

void main() {
    float speed = 4.0;

    vec3 palette[4] = vec3[4](
        vec3(1, 0.2, 0.4), 
        vec3(1, 0.7647058823529411, 0.30196078431372547), 
        vec3(0.4980392156862745, 0.8392156862745098, 1), 
        vec3(0.5411764705882353, 0.3568627450980392, 1)
    );

    vec2 pixel = gl_FragCoord.xy;
    vec2 uv = pixel / resolution;                // 0..1
    vec2 centered = (uv - 0.5) * vec2(resolution.x / resolution.y, 1.0);

    float t = time / 1000.0 * speed;

    // animated centers
    vec2 c0 = 0.55 * vec2(sin(t * 0.70 + 0.0), cos(t * 0.63 + 1.2));
    vec2 c1 = 0.65 * vec2(sin(t * 0.42 + 2.1), cos(t * 0.47 + 0.3));
    vec2 c2 = 0.75 * vec2(sin(t * 0.31 + 4.2), cos(t * 0.29 + 2.7));
    vec2 c3 = 0.60 * vec2(sin(t * 0.55 + 5.8), cos(t * 0.52 + 4.6));
    vec2 c4 = 0.80 * vec2(sin(t * 0.25 + 3.4), cos(t * 0.21 + 5.1));

    // gaussian radii
    float r0 = 0.90, r1 = 0.85, r2 = 0.80, r3 = 0.95, r4 = 1.10;

    // weights from blobs
    float w0 = gaussian(centered - c0, r0);
    float w1 = gaussian(centered - c1, r1);
    float w2 = gaussian(centered - c2, r2);
    float w3 = gaussian(centered - c3, r3);
    float w4 = gaussian(centered - c4, r4);

    // derive four smooth channels
    float a = w0 + 0.6 * w4;
    float b = w1 + 0.6 * w0;
    float c = w2 + 0.6 * w1;
    float d = w3 + 0.6 * w2;

    // soften edges
    a = pow(a, 0.6);
    b = pow(b, 0.6);
    c = pow(c, 0.6);
    d = pow(d, 0.6);

    vec3 color = blendPalette(a, b, c, d);

    // gentle vignette for depth
    float vignette = smoothstep(0.95, 0.35, length(centered));
    color *= mix(1.05, 0.92, vignette);

    output_color = vec4(color, 1.0);
}