import * as x3d from "x3d"


export interface LiquidGradientMaterialProps {
    colors: x3d.Color[]
    seed?: number
}

export class LiquidGradientMaterial extends x3d.Material {
    shader: string = "liquid-gradient"
    colors: x3d.Color[]
    seed: number

    constructor(props: LiquidGradientMaterialProps & x3d.MaterialProps) {
        if (props.colors.length < 2 || props.colors.length > 4) {
            throw new Error("Liquid Gradient only works with [2-4] colors")
        }

        super(props)
        this.colors = props.colors
        this.seed = props.seed ?? 5
    }

    params(): Record<string, x3d.MaterialValue> {
        return {
            speed: { type: "float", value: 0.000005 },
            frequency: { type: "vector2", value: new x3d.Vector2(0.00014, 0.00029) },
            color: { type: "vector3", value: this.colors[0].rgbFloat() },
            layers: {
                type: "array",
                of: { type: "struct" },
                value: this.colors.slice(1).map((c, i) => ({
                    type: "struct",
                    fields: {
                        color: { type: "vector3", value: c.rgbFloat() },
                        floor: { type: "float", value: 0.1 },
                        ceiling: { type: "float", value: 0.63 + 0.07 * i },
                        speed: { type: "float", value: 11 + 0.3 * i },
                        frequency: { type: "vector2", value: new x3d.Vector2(2 + i / this.colors.length, 3 + i / this.colors.length) },
                        flow: { type: "float", value: 6.5 + 0.3 * i },
                        seed: { type: "float", value: this.seed + 10 * i }
                    }
                })) 
            },
            deformation: { 
                type: "struct", 
                fields: {
                    incline: { type: "float", value: 0 },
                    offsetTop: { type: "float", value: -0.5 },
                    offsetBottom: { type: "float", value: -0.5 },
                    speed: { type: "float", value: 10 },
                    frequency: { type: "vector2", value: new x3d.Vector2(3, 4) },
                    amplitude: { type: "float", value: 320 },
                    flow: { type: "float", value: 3 },
                    seed: { type: "float", value: this.seed }
                }
            }
        }
    }
}