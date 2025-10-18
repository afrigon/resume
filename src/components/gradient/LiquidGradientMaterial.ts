import * as x3d from "x3d"

export interface LiquidGradientMaterialProps {
    color1: x3d.Color
    color2: x3d.Color
    color3: x3d.Color
    color4: x3d.Color
}

export class LiquidGradientMaterial extends x3d.Material {
    shader: string = "liquid-gradient"
    color1: x3d.Color
    color2: x3d.Color
    color3: x3d.Color
    color4: x3d.Color

    constructor(props: LiquidGradientMaterialProps & x3d.MaterialProps) {
        super(props)

        this.color1 = props.color1
        this.color2 = props.color2
        this.color3 = props.color3
        this.color4 = props.color4
    }

    params(): Map<string, x3d.MaterialValue> {
        return new Map(Object.entries({
            color1: this.color1,
            color2: this.color2,
            color3: this.color3,
            color4: this.color4,
        }))
    }
}