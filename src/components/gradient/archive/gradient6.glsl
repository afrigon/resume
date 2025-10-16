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
    float amplitude = 0.6;
    float frequency = 1.0;
    for (int octave = 0; octave < 5; ++octave) {
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

// sunset gradient: orange → red → hot pink, with a *tiny* purple accent near the top end
vec3 gradient_sunset(float t) {
    t = clamp(t, 0.0, 1.0);
    const vec3 orange = vec3(1.00, 0.49, 0.18); // #FF7D2E
    const vec3 red    = vec3(1.00, 0.17, 0.17); // #FF2B2B
    const vec3 pink   = vec3(1.00, 0.29, 0.73); // #FF4AB9
    const vec3 purple = vec3(0.58, 0.28, 0.98); // #953FFB

    // piecewise with warm bias; purple only touches the very end
    float s0 = 0.00;
    float s1 = 0.45;
    float s2 = 0.85;
    float s3 = 1.00;

    if (t < s1) {
        float u = smoothstep(0.0, 1.0, (t - s0) / (s1 - s0));
        return mix(orange, red, u);
    } else if (t < s2) {
        float u = smoothstep(0.0, 1.0, (t - s1) / (s2 - s1));
        return mix(red, pink, u);
    } else {
        float u = smoothstep(0.0, 1.0, (t - s2) / (s3 - s2));
        // purple contribution capped very low
        return mix(pink, mix(pink, purple, 0.12), u);
    }
}

// --- main --------------------------------------------------------------------

void main() {
    vec2 size = resolution;
    vec2 uv = gl_FragCoord.xy / size;

    // center and preserve aspect
    vec2 aspect = vec2(size.x / size.y, 1.0);
    vec2 position = (uv - 0.5) * aspect;

    float t = time * 0.001;

    // controlled drift to avoid static centers
    vec2 drift = 0.18 * vec2(sin(t * 0.32) + 0.4 * sin(t * 0.71),
                             cos(t * 0.28) + 0.4 * cos(t * 0.67));

    // domain warp tuned for clearer shapes (less haze)
    vec2 warp_a = vec2(
        fbm(position * 1.40 + vec2(0.0, t * 0.14)),
        fbm(position * 1.40 + vec2(t * 0.12, 0.0))
    );
    vec2 warp_b = vec2(
        fbm(position * 2.40 - vec2(t * 0.16, 0.0)),
        fbm(position * 2.40 + vec2(0.0, t * 0.15))
    );
    vec2 warped = position * 1.38 + drift + 0.50 * (warp_a * 2.0 - 1.0) + 0.35 * (warp_b * 2.0 - 1.0);

    // liquid intensity with slightly higher contrast
    float f0 = fbm(warped * 1.25 + t * 0.08);
    float f1 = fbm(warped * 2.30 - t * 0.11);
    float field = mix(f0, f1, 0.55);
    field = pow(field, 0.85);

    // soft envelopes to create bold, glassy swells
    vec2 c0 = 0.88 * vec2(sin(t * 0.31 + 0.0), cos(t * 0.27 + 1.2));
    vec2 c1 = 0.92 * vec2(sin(t * 0.26 + 2.1), cos(t * 0.30 + 0.4));
    vec2 c2 = 0.74 * vec2(sin(t * 0.39 + 4.6), cos(t * 0.35 + 3.0));
    float g0 = exp(-dot(position - c0, position - c0) / (2.0 * 0.90 * 0.90));
    float g1 = exp(-dot(position - c1, position - c1) / (2.0 * 1.00 * 1.00));
    float g2 = exp(-dot(position - c2, position - c2) / (2.0 * 0.85 * 0.85));
    field = pow(field + 0.82 * (0.42 * g0 + 0.34 * g1 + 0.30 * g2), 0.88);

    // compute gradient for liquid-glass normals
    float e = 0.0018;
    float fx1 = fbm((warped + vec2( e, 0.0)) * 1.25 + t * 0.08);
    float fx0 = fbm((warped + vec2(-e, 0.0)) * 1.25 + t * 0.08);
    float fy1 = fbm((warped + vec2(0.0,  e)) * 1.25 + t * 0.08);
    float fy0 = fbm((warped + vec2(0.0, -e)) * 1.25 + t * 0.08);
    vec2 grad = vec2(fx1 - fx0, fy1 - fy0);

    vec3 normal = normalize(vec3(grad * 2.1, 1.0));

    // warm-toned base color with slight time wobble
    float tone = clamp(field * 1.08 + 0.03 * sin(t * 0.22), 0.0, 1.0);
    vec3 base_color = gradient_sunset(tone);

    // gentle refraction with minimal dispersion to keep clarity
    float refract_power = 0.018;
    float dispersion = 0.004;
    vec2 off_r = normal.xy * (refract_power + dispersion);
    vec2 off_g = normal.xy * (refract_power);
    vec2 off_b = normal.xy * (refract_power - dispersion);

    float s_r = fbm((warped + off_r) * 1.9 - t * 0.03);
    float s_g = fbm((warped + off_g) * 1.9 + t * 0.02);
    float s_b = fbm((warped + off_b) * 1.9 - t * 0.01);

    vec3 refracted = base_color * vec3(s_r, s_g, s_b);
    vec3 color = mix(base_color, refracted, 0.58);

    // warm lighting and subtle fresnel for edge glow
    vec3 light_dir = normalize(vec3(-0.25, 0.35, 0.90));
    float n_dot_l = clamp(dot(normal, light_dir), 0.0, 1.0);
    float fresnel = pow(1.0 - clamp(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.0);

    color *= 0.62 + 0.38 * n_dot_l;
    color += vec3(fresnel) * 0.18;

    // push vibrance while staying warm-forward
    color = saturate_color(color, 1.60);
    color = pow(color, vec3(0.92));

    // gentle vignette to frame without muting the warmth
    float r = length(position);
    float vignette = smoothstep(1.26, 0.50, r);
    color *= mix(1.02, 0.92, vignette);

    // micro grain to avoid banding
    float grain = hash_fn(gl_FragCoord.xy + fract(t) * 713.17) * 2.0 - 1.0;
    color += 0.004 * grain;

    output_color = vec4(color, 1.0);
}
