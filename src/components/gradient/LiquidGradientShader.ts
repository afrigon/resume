import vertex from "./liquid_gradient_vertex.glsl?raw"
import fragment from "./liquid_gradient_fragment.glsl?raw"
import * as x3d from "x3d"

export class LiquidGradientShader extends x3d.ManagedShader {
    constructor() {
        super({
            id: "liquid-gradient",
            vertex,
            fragment: fragment,
            structures: [
                { 
                    name: "Layer", 
                    fields: {
                        color: { type: "vec3" },
                        floor: { type: "float" },
                        ceiling: { type: "float" },
                        speed: { type: "float" },
                        frequency: { type: "vec2" },
                        flow: { type: "float" },
                        seed: { type: "float" }
                    }
                },
                {
                    name: "Deformation",
                    fields: {
                        incline: { type: "float" },
                        offsetTop: { type: "float" },
                        offsetBottom: { type: "float" },
                        speed: { type: "float" },
                        frequency: { type: "vec2" },
                        amplitude: { type: "float" },
                        flow: { type: "float" },
                        seed: { type: "float" }
                    }
                }
            ],
            uniforms: {
                speed: { type: "float" },
                frequency: { type: "vec2" },
                color: { type: "vec3" },
                layers: {
                    type: "array", 
                    size: 3, 
                    of: { type: "struct", name: "Layer" }
                },
                deformation: { type: "struct", name: "Deformation" }
            },
            globals: true
        })
    }
}
