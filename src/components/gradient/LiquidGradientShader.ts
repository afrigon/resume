import vertex from "./liquid_gradient_vertex.glsl?raw"
import fragment from "./liquid_gradient_fragment.glsl?raw"
import * as x3d from "x3d"

export class LiquidGradientShader extends x3d.ManagedShader {
    constructor() {
        super({
            id: "liquid-gradient",
            vertex,
            fragment: fragment,
            params: [
                ...x3d.ShaderParam.default(),
                new x3d.ShaderParam("vec4", "color1", x3d.Color.white.vector),
                new x3d.ShaderParam("vec4", "color2", x3d.Color.white.vector),
                new x3d.ShaderParam("vec4", "color3", x3d.Color.white.vector),
                new x3d.ShaderParam("vec4", "color4", x3d.Color.white.vector)
            ]
        })
    }
}
