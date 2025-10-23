layout(location = 0) in vec3 input_vertex;
layout(location = 1) in vec3 input_normal;
layout(location = 2) in vec2 input_uv;

out vec3 v_color;
out vec2 v_uv;

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) { 
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Permutations
    i = mod289(i); 
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0)) 
        + i.x + vec4(0.0, i1.x, i2.x, 1.0)
    );

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 105.0 * dot(
        m * m, 
        vec4(
            dot(p0,x0), 
            dot(p1,x1), 
            dot(p2,x2), 
            dot(p3,x3) 
        )
    );
}

vec3 blendNormal(vec3 base, vec3 blend) {
	return blend;
}

vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
	return (blendNormal(base, blend) * opacity + base * (1.0 - opacity));
}

void main() {
    v_uv = input_uv;
    vec2 uv_norm = input_uv * 2.0 - 1.0;

    float time = globals.time * speed;
    vec2 noise_coords = globals.resolution * uv_norm * frequency;
    
    float tilt = globals.resolution.y / 2.0 * uv_norm.y;
    float incline = globals.resolution.x * uv_norm.x / 2.0 * deformation.incline;
    float offset = globals.resolution.x / 2.0 * deformation.incline * mix(deformation.offsetBottom, deformation.offsetTop, input_uv.y);

    float noise = snoise(
        vec3(
            noise_coords.x * deformation.frequency.x + time * deformation.flow,
            noise_coords.y * deformation.frequency.y,
            time * deformation.speed + deformation.seed
        )
    ) * deformation.amplitude;

    noise *= 1.0 - pow(abs(uv_norm.y), 2.0);
    noise = max(0.0, noise);

    vec3 position = vec3(
        input_vertex.x,
        input_vertex.y + tilt + incline + noise - offset,
        input_vertex.z
    );

    v_color = color;

    for (int i = 0; i < 3; i++) {
        Layer layer = layers[i];

        float noise = smoothstep(
            layer.floor,
            layer.ceiling,
            snoise(vec3(
                noise_coords.x * layer.frequency.x + time * layer.flow,
                noise_coords.y * layer.frequency.y,
                time * layer.speed + layer.seed
            )) / 2.0 + 0.5
        );

        v_color = blendNormal(v_color, layer.color, pow(noise, 4.));
    }

    gl_Position = globals.mvp * vec4(position, 1.0);
}
