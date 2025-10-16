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

// cosine palette (vibrant but smooth)
vec3 palette_cosine(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.2831853 * (c * t + d));
}

// saturation control
vec3 saturate_color(vec3 color, float k) {
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    return mix(vec3(luma), color, k);
}

// --- main --------------------------------------------------------------------

void main() {
    vec2 size = resolution;
    vec2 uv = gl_FragCoord.xy / size;

    // center and keep aspect
    vec2 aspect = vec2(size.x / size.y, 1.0);
    vec2 position = (uv - 0.5) * aspect;

    float t = time * 0.001;

    // slow base drift
    vec2 drift = vec2(
        0.35 * sin(t * 0.27) + 0.15 * sin(t * 0.63),
        0.35 * cos(t * 0.23) + 0.15 * cos(t * 0.57)
    );

    // domain warp for liquid motion
    vec2 warp_a = vec2(
        fbm(position * 1.25 + vec2(0.0, t * 0.12)),
        fbm(position * 1.25 + vec2(t * 0.10, 0.0))
    );
    vec2 warp_b = vec2(
        fbm(position * 2.60 - vec2(t * 0.16, 0.0)),
        fbm(position * 2.60 + vec2(0.0, t * 0.14))
    );
    vec2 warped = position * 1.35 + drift + 0.55 * (warp_a * 2.0 - 1.0) + 0.35 * (warp_b * 2.0 - 1.0);

    // soft "liquid field" combining layered fbm and large gaussian-like envelopes
    float field =
        0.70 * fbm(warped * 1.30 + t * 0.07) +
        0.30 * fbm(warped * 3.10 - t * 0.11);

    // three slow-moving soft blobs to emphasize organic shapes
    vec2 c0 = 0.85 * vec2(sin(t * 0.33 + 0.0), cos(t * 0.29 + 1.2));
    vec2 c1 = 0.95 * vec2(sin(t * 0.27 + 2.1), cos(t * 0.31 + 0.4));
    vec2 c2 = 0.75 * vec2(sin(t * 0.41 + 4.6), cos(t * 0.37 + 3.0));
    float g0 = exp(-dot(position - c0, position - c0) / (2.0 * 0.95 * 0.95));
    float g1 = exp(-dot(position - c1, position - c1) / (2.0 * 1.05 * 1.05));
    float g2 = exp(-dot(position - c2, position - c2) / (2.0 * 0.85 * 0.85));
    field = pow(field + 0.9 * (0.40 * g0 + 0.35 * g1 + 0.30 * g2), 0.92);

    // compute pseudo-normal from field gradient for "liquid glass" lighting
    float e = 0.0018;
    float f_x1 = fbm((warped + vec2( e, 0.0)) * 1.30 + t * 0.07);
    float f_x0 = fbm((warped + vec2(-e, 0.0)) * 1.30 + t * 0.07);
    float f_y1 = fbm((warped + vec2(0.0,  e)) * 1.30 + t * 0.07);
    float f_y0 = fbm((warped + vec2(0.0, -e)) * 1.30 + t * 0.07);
    vec2 grad = vec2(f_x1 - f_x0, f_y1 - f_y0);

    // refractive normal; z tilts surface strength
    vec3 normal = normalize(vec3(grad * 2.2, 1.0));

    // environment tint based on a vibrant cosine palette along the field
    vec3 env_a = palette_cosine(
        field,
        vec3(0.62, 0.45, 0.70),
        vec3(0.55, 0.65, 0.55),
        vec3(1.00, 0.85, 0.75),
        vec3(0.00, 0.33, 0.67)
    );

    // second palette layer to increase richness
    vec3 env_b = palette_cosine(
        field * 1.15 + 0.1 * sin(t * 0.2),
        vec3(0.55, 0.52, 0.50),
        vec3(0.50, 0.60, 0.65),
        vec3(0.85, 1.05, 1.20),
        vec3(0.25, 0.60, 0.85)
    );

    vec3 base_color = mix(env_a, env_b, 0.45);

    // fake refraction: offset sample coordinates with normal to "bend" colors
    float refract_power = 0.020;
    float dispersion = 0.007; // subtle channel separation
    vec2 offset_r = normal.xy * (refract_power + dispersion);
    vec2 offset_g = normal.xy * (refract_power);
    vec2 offset_b = normal.xy * (refract_power - dispersion);

    float sample_r = fbm((warped + offset_r) * 2.0 - t * 0.03);
    float sample_g = fbm((warped + offset_g) * 2.0 + t * 0.02);
    float sample_b = fbm((warped + offset_b) * 2.0 - t * 0.01);

    vec3 refracted = base_color * vec3(sample_r, sample_g, sample_b);
    refracted = mix(base_color, refracted, 0.65);

    // lighting: single soft key light + fresnel for glassy edges
    vec3 light_dir = normalize(vec3(0.35, 0.45, 0.88));
    float ndotl = clamp(dot(normal, light_dir), 0.0, 1.0);
    float fresnel = pow(1.0 - clamp(dot(normal, normalize(vec3(0.0, 0.0, 1.0))), 0.0, 1.0), 2.5);

    vec3 diffuse = refracted * (0.55 + 0.45 * ndotl);
    vec3 specular = vec3(pow(ndotl, 24.0)) * 0.25 + vec3(fresnel) * 0.35;

    vec3 color = diffuse + specular;

    // saturation and gentle tone mapping
    color = saturate_color(color, 1.35);
    color = pow(color, vec3(0.92));

    // vignette to frame
    float r = length(position);
    float vignette = smoothstep(1.30, 0.45, r);
    color *= mix(1.03, 0.90, vignette);

    // subtle grain against banding
    float grain = hash_fn(gl_FragCoord.xy + fract(t) * 531.97) * 2.0 - 1.0;
    color += 0.005 * grain;

    output_color = vec4(color, 1.0);
}
