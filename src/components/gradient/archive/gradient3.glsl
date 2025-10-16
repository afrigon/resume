#version 300 es
precision highp float;

uniform vec2 resolution;
uniform float time; // milliseconds

out vec4 output_color;

// vivid palette via cosine luma-preserving mix
vec3 palette_cosine(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.2831853 * (c * t + d));
}

// simple hash and noise
float hash_fn(vec2 p) {
    p = fract(p * vec2(443.8975, 441.423));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
}

float value_noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash_fn(i);
    float b = hash_fn(i + vec2(1.0, 0.0));
    float c = hash_fn(i + vec2(0.0, 1.0));
    float d = hash_fn(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// fractal brownian motion
float fbm(vec2 p) {
    float sum = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int octave = 0; octave < 6; ++octave) {
        sum += amplitude * value_noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return sum;
}

// ridged variant for harder features
float fbm_ridged(vec2 p) {
    float sum = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int octave = 0; octave < 6; ++octave) {
        float n = value_noise(p * frequency);
        n = 1.0 - abs(2.0 * n - 1.0);
        sum += amplitude * n;
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return sum;
}

// saturation boost
vec3 saturate_color(vec3 color, float k) {
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    return mix(vec3(luma), color, k);
}

void main() {
    vec2 size = resolution;
    vec2 uv = gl_FragCoord.xy / size;

    // center and fix aspect ratio
    vec2 aspect = vec2(size.x / size.y, 1.0);
    vec2 position = (uv - 0.5) * aspect;

    float t = time * 0.001;

    // strong domain warp for liquid motion
    vec2 warp_a = vec2(
        fbm(position * 1.7 + vec2(0.0, t * 0.23)),
        fbm(position * 1.7 + vec2(t * 0.19, 0.0))
    );
    vec2 warp_b = vec2(
        fbm(position * 3.1 - vec2(t * 0.17, 0.0)),
        fbm(position * 3.1 + vec2(0.0, t * 0.21))
    );
    vec2 warped = position * 1.85 + 0.9 * (warp_a * 2.0 - 1.0) + 0.5 * (warp_b * 2.0 - 1.0);

    // combine smooth and ridged fields
    float field_smooth = fbm(warped * 1.4 + t * 0.11);
    float field_ridged = fbm_ridged(warped * 2.6 - t * 0.15);
    float field = mix(field_smooth, field_ridged, 0.65);

    // amplify contrast
    field = pow(field, 0.75);

    // quantize to create hard bands
    float steps = 7.0; // increase for more band lines
    float quantized = floor(field * steps) / steps;

    // sharpen band edges using a local edge factor
    float edge = abs(fract(field * steps) - 0.5);
    edge = smoothstep(0.22, 0.02, edge); // thin bright rims on band boundaries

    // build a vibrant palette along quantized value with a secondary scanline phase
    float phase = quantized + 0.07 * sin(6.2831853 * (position.x * 0.35 - position.y * 0.28 + t * 0.18));

    // neon-like palette parameters
    vec3 base = palette_cosine(
        phase,
        vec3(0.55, 0.45, 0.55),          // base level
        vec3(0.45, 0.55, 0.45),          // amplitude
        vec3(0.95, 0.85, 0.75),          // frequency per channel
        vec3(0.00, 0.33, 0.67)           // phase shift
    );

    // mix in a bold triad to push saturation further
    vec3 triad = palette_cosine(
        phase * 1.3,
        vec3(0.5, 0.5, 0.5),
        vec3(0.5, 0.5, 0.5),
        vec3(1.0, 1.0, 1.0),
        vec3(0.20, 0.55, 0.85)
    );

    vec3 color = mix(base, triad, 0.55);

    // hard-edge highlight along band boundaries
    color = mix(color, vec3(1.0), 0.22 * edge);

    // subtle directional bias for depth
    float diag = smoothstep(-0.6, 0.9, position.y + position.x * 0.18);
    color *= mix(0.95, 1.08, diag);

    // saturation and contrast boost
    color = saturate_color(color, 1.45);
    color = pow(color, vec3(0.85));

    // slight glow on bright regions
    float highlight = smoothstep(0.75, 1.10, max(max(color.r, color.g), color.b));
    color += highlight * 0.06;

    // fine grain to fight banding
    float grain = hash_fn(gl_FragCoord.xy + fract(t) * 901.37) * 2.0 - 1.0;
    color += 0.006 * grain;

    output_color = vec4(color, 1.0);
}
