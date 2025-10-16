import { CSSProperties } from "react"
import useGeometryReader from "../../hooks/UseGeometryReader"

interface ProjectAnimationViewProps {
    type: "sticky" | "standalone"
    color: string
}

export default function ProjectAnimationView({ type = "sticky", color }: ProjectAnimationViewProps) {
    const [ref, geometry] = useGeometryReader()

    let classes: string = "mx-4 w-auto aspect-square"
    const style: CSSProperties = {}

    if (type == "sticky") {
        classes += " sticky"
        style.top = `calc(50% - ${geometry.height / 2}px)`
    }

    return (
        <div ref={ref} className={classes} style={style}>
            <div className="w-full h-full" style={{ backgroundColor: color }}></div>
        </div>
    )
}
