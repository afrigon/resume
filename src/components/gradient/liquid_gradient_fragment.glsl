in vec3 v_normal;
in vec3 v_color;

out vec4 output_color;

void main() {
    output_color = vec4(v_color, 1.0);
}