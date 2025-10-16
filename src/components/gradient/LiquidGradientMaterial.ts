import * as x3d from "x3d"

export interface LiquidGradientMaterialProps {
    color: x3d.Color
}

export class LiquidGradientMaterial extends x3d.Material {
    shader: string = "liquid-gradient"
    color: x3d.Color

    constructor(props: LiquidGradientMaterialProps & x3d.MaterialProps) {
        super(props)

        this.color = props.color
    }

    params(): Map<string, x3d.MaterialValue> {
        return new Map(Object.entries({
            color: this.color
        }))
    }
}