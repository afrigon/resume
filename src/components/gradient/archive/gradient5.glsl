#version 300 es
precision highp float;

uniform vec2 resolution;
uniform float time; // milliseconds

out vec4 output_color;

// --- utilities ---------------------------------------------------------------

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

vec3 saturate_color(vec3 color, float k) {
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    return mix(vec3(luma), color, k);
}

// piecewise sunset synthwave gradient: orange -> red -> pink -> purple
vec3 gradient_sunset(float t) {
    t = clamp(t, 0.0, 1.0);
    const vec3 c0 = vec3(1.00, 0.38, 0.00); // vibrant orange (#FF6100)
    const vec3 c1 = vec3(1.00, 0.12, 0.12); // hot red (#FF1F1F)
    const vec3 c2 = vec3(1.00, 0.28, 0.85); // neon pink (#FF48D8)
    const vec3 c3 = vec3(0.42, 0.18, 1.00); // electric purple (#6B2DFF)

    float s0 = 0.00;
    float s1 = 0.33;
    float s2 = 0.66;
    float s3 = 1.00;

    if (t < s1) {
        float u = smoothstep(0.0, 1.0, (t - s0) / (s1 - s0));
        return mix(c0, c1, u);
    } else if (t < s2) {
        float u = smoothstep(0.0, 1.0, (t - s1) / (s2 - s1));
        return mix(c1, c2, u);
    } else {
        float u = smoothstep(0.0, 1.0, (t - s2) / (s3 - s2));
        return mix(c2, c3, u);
    }
}

// --- main --------------------------------------------------------------------

void main() {
    vec2 size = resolution;
    vec2 uv = gl_FragCoord.xy / size;

    // center and keep aspect
    vec2 aspect = vec2(size.x / size.y, 1.0);
    vec2 position = (uv - 0.5) * aspect;

    float t = time * 0.001;

    // gentle global drift
    vec2 drift = 0.22 * vec2(sin(t * 0.35) + 0.5 * sin(t * 0.77), cos(t * 0.31) + 0.5 * cos(t * 0.71));

    // domain warp for liquid motion
    vec2 warp_a = vec2(
        fbm(position * 1.35 + vec2(0.0, t * 0.14)),
        fbm(position * 1.35 + vec2(t * 0.12, 0.0))
    );
    vec2 warp_b = vec2(
        fbm(position * 2.75 - vec2(t * 0.18, 0.0)),
        fbm(position * 2.75 + vec2(0.0, t * 0.16))
    );
    vec2 warped = position * 1.45 + drift + 0.55 * (warp_a * 2.0 - 1.0) + 0.40 * (warp_b * 2.0 - 1.0);

    // liquid intensity field
    float base = fbm(warped * 1.25 + t * 0.08);
    float detail = fbm(warped * 2.60 - t * 0.12);
    float field = mix(base, detail, 0.55);

    // large soft envelopes for glassy shapes
    vec2 c0 = 0.90 * vec2(sin(t * 0.33 + 0.0), cos(t * 0.29 + 1.2));
    vec2 c1 = 0.95 * vec2(sin(t * 0.27 + 2.1), cos(t * 0.31 + 0.4));
    vec2 c2 = 0.78 * vec2(sin(t * 0.41 + 4.6), cos(t * 0.37 + 3.0));
    float g0 = exp(-dot(position - c0, position - c0) / (2.0 * 1.00 * 1.00));
    float g1 = exp(-dot(position - c1, position - c1) / (2.0 * 1.10 * 1.10));
    float g2 = exp(-dot(position - c2, position - c2) / (2.0 * 0.90 * 0.90));
    field = pow(field + 0.85 * (0.40 * g0 + 0.35 * g1 + 0.30 * g2), 0.90);

    // compute gradient for "liquid glass" normals
    float e = 0.0020;
    float f_x1 = fbm((warped + vec2( e, 0.0)) * 1.25 + t * 0.08);
    float f_x0 = fbm((warped + vec2(-e, 0.0)) * 1.25 + t * 0.08);
    float f_y1 = fbm((warped + vec2(0.0,  e)) * 1.25 + t * 0.08);
    float f_y0 = fbm((warped + vec2(0.0, -e)) * 1.25 + t * 0.08);
    vec2 grad = vec2(f_x1 - f_x0, f_y1 - f_y0);

    vec3 normal = normalize(vec3(grad * 2.0, 1.0));

    // map field to vibrant sunset palette
    float tone = clamp(field * 1.05 + 0.05 * sin(t * 0.25), 0.0, 1.0);
    vec3 base_color = gradient_sunset(tone);

    // refractive color bend with slight chromatic dispersion
    float refract_power = 0.022;
    float dispersion = 0.006;
    vec2 off_r = normal.xy * (refract_power + dispersion);
    vec2 off_g = normal.xy * (refract_power);
    vec2 off_b = normal.xy * (refract_power - dispersion);

    float s_r = fbm((warped + off_r) * 2.0 - t * 0.03);
    float s_g = fbm((warped + off_g) * 2.0 + t * 0.02);
    float s_b = fbm((warped + off_b) * 2.0 - t * 0.01);

    vec3 refracted = base_color * vec3(s_r, s_g, s_b);
    vec3 color = mix(base_color, refracted, 0.65);

    // soft lighting and fresnel for glass edge glow
    vec3 light_dir = normalize(vec3(-0.25, 0.45, 0.86));
    float ndotl = clamp(dot(normal, light_dir), 0.0, 1.0);
    float fresnel = pow(1.0 - clamp(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.2);
    color *= 0.60 + 0.40 * ndotl;
    color += vec3(fresnel) * 0.22;

    // push saturation and gentle tone map
    color = saturate_color(color, 1.55);
    color = pow(color, vec3(0.90));

    // vignette to frame without killing vibrance
    float r = length(position);
    float vignette = smoothstep(1.28, 0.48, r);
    color *= mix(1.02, 0.92, vignette);

    // micro grain to avoid banding
    float grain = hash_fn(gl_FragCoord.xy + fract(t) * 811.31) * 2.0 - 1.0;
    color += 0.0045 * grain;

    output_color = vec4(color, 1.0);
}
