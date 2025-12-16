import { CSSProperties, ReactNode } from "react"

interface ProjectAnimationViewProps {
    children: ReactNode
}

export default function ProjectAnimationView({ children }: ProjectAnimationViewProps) {
    const classes: string = "mx-4 w-auto aspect-square"
    const style: CSSProperties = {}

    return (
        <div className={classes} style={style}>
            <div className="w-full h-full flex flex-col justify-center px-8 max-tiny:px-0">
                { children }
            </div>
        </div>
    )
}
