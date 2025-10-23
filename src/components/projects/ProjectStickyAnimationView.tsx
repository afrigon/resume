import { ReactNode } from "react"
import useGeometryReader from "../../hooks/UseGeometryReader"
import { motion } from "motion/react"

interface ProjectStickyAnimationContainerViewProps {
    height: number
    children: ReactNode[]
}

interface ProjectStickyAnimationViewProps {
    displayed: boolean
    children: ReactNode
}

export function ProjectStickyAnimationView({ displayed, children }: ProjectStickyAnimationViewProps) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 1.05
            }}
            animate={{
                opacity: displayed ? 1 : 0,
                scale: displayed ? 1 : 1.05
            }}
            className="w-full absolute top-1/2 -translate-y-1/2 left-0"
        >
            {children}
        </motion.div>
    )
}

export function ProjectStickyAnimationContainerView({ height, children }: ProjectStickyAnimationContainerViewProps) {
    const [ref, geometry] = useGeometryReader()

    return (
        <figure className="hidden desktop:block relative self-start my-48">
            <div className="absolute left-0 top-0 w-full" style={{ height }}>
                <div
                    ref={ref}
                    className="mx-4 w-auto aspect-square sticky"
                    style={{ top: `calc(50% - ${geometry.height / 2}px)` }}
                >
                    {children}
                </div>
            </div>
        </figure>
    )
}
