#version 300 es
precision highp float;

uniform vec2 resolution;
uniform float time; // milliseconds

out vec4 output_color;

// bold palette
const vec3 palette_0 = vec3(1.00, 0.10, 0.40);
const vec3 palette_1 = vec3(1.00, 0.78, 0.25);
const vec3 palette_2 = vec3(0.35, 0.82, 1.00);
const vec3 palette_3 = vec3(0.63, 0.35, 1.00);

// stronger motion and shaping
const float motion_speed = 0.75;
const float noise_scale = 1.75;
const float contrast_factor = 1.18;
const float saturation_boost = 1.25;

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

float fbm(vec2 p) {
    float sum = 0.0;
    float amplitude = 0.55;
    float frequency = 1.0;
    for (int octave = 0; octave < 6; ++octave) {
        sum += amplitude * value_noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return sum;
}

float gaussian(vec2 p, float radius) {
    float d = dot(p, p);
    return exp(-d / (2.0 * radius * radius));
}

vec3 blend_palettes(vec4 w) {
    float s = w.x + w.y + w.z + w.w + 1e-6;
    w /= s;
    return palette_0 * w.x + palette_1 * w.y + palette_2 * w.z + palette_3 * w.w;
}

vec3 saturate(vec3 c, float k) {
    float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
    return mix(vec3(luma), c, k);
}

void main() {
    vec2 pixel = gl_FragCoord.xy;
    vec2 size = resolution;
    vec2 aspect = vec2(size.x / size.y, 1.0);

    vec2 position = (pixel / size - 0.5) * aspect;
    float time_seconds = time * 0.001;
    float t = time_seconds * motion_speed;

    // heavier domain warp
    vec2 warp_dir = vec2(
        fbm(position * 1.6 + vec2(0.0, t * 0.23)),
        fbm(position * 1.6 + vec2(t * 0.27, 0.0))
    );
    warp_dir = warp_dir * 2.0 - 1.0;

    vec2 warped = position * noise_scale + 1.0 * warp_dir;

    float base = fbm(warped * 1.2 + t * 0.10);
    float detail = fbm(warped * 3.3 - t * 0.16);
    float structure = mix(base, detail, 0.7);

    // larger, punchier blobs
    vec2 center_0 = 1.00 * vec2(sin(t * 0.42 + 0.0), cos(t * 0.39 + 1.2));
    vec2 center_1 = 1.10 * vec2(sin(t * 0.31 + 2.7), cos(t * 0.36 + 0.4));
    vec2 center_2 = 0.95 * vec2(sin(t * 0.57 + 5.1), cos(t * 0.51 + 3.2));

    float blob_0 = gaussian(position - center_0, 0.90);
    float blob_1 = gaussian(position - center_1, 1.00);
    float blob_2 = gaussian(position - center_2, 0.80);

    // harder shaping for separation
    vec4 channels = vec4(
        pow(structure + 1.2 * blob_0, 0.75),
        pow(structure + 1.2 * blob_1, 0.75),
        pow(structure + 1.2 * blob_2, 0.75),
        pow(structure * 0.7 + 0.7 * (blob_0 + blob_1 + blob_2) / 3.0, 0.8)
    );

    // multi-band highlights
    float band_base = position.x * 0.9 - position.y * 0.7 + t * 0.28;
    float band_a = smoothstep(0.35, 0.65, 0.5 + 0.5 * sin(3.14159 * band_base));
    float band_b = smoothstep(0.35, 0.65, 0.5 + 0.5 * sin(3.14159 * (band_base * 0.6 + 1.7)));
    float bands = clamp(band_a * 0.55 + band_b * 0.45, 0.0, 1.0);

    vec3 color = blend_palettes(channels);
    color = saturate(color, saturation_boost);
    color = mix(color, vec3(1.0), 0.18 * bands);

    // diagonal energy
    float diagonal = smoothstep(-0.7, 0.9, position.y + position.x * 0.18);
    color *= mix(0.96, 1.08, diagonal);

    // vignette and contrast
    float r = length(position);
    float vignette = smoothstep(1.25, 0.30, r);
    color *= mix(1.03, 0.88, vignette);
    color = pow(color, vec3(contrast_factor));

    // slight bloom-ish lift
    float highlight = smoothstep(0.85, 1.10, max(max(color.r, color.g), color.b));
    color += highlight * 0.06;

    // grain
    float grain = hash_fn(pixel + fract(t) * 721.3) * 2.0 - 1.0;
    color += grain * 0.008;

    output_color = vec4(color, 1.0);
}