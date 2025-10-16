import ProjectView from "./ProjectView"
import ProjectAnimationView from "./ProjectAnimationView"
import useGeometryReader from "../../hooks/UseGeometryReader"
import { ProjectStickyAnimationView, ProjectStickyAnimationContainerView } from "./ProjectStickyAnimationView"
import { useEffect, ReactNode, useRef, useState } from "react"
import { useInView } from "motion/react"
import projects from "./Projects"

interface AnchorProps {
    id: string
    callback: (_: string) => void
    children: ReactNode
}

function Anchor({ id, callback, children }: AnchorProps) {
    const ref = useRef(null)
    const isInView = useInView(ref)

    useEffect(() => {
        if (isInView) {
            callback(id)
        }
    }, [isInView, callback, id])

    return <div ref={ref}>{children}</div>
}

export default function ProjectCollectionView() {
    const [ref, geometry] = useGeometryReader()
    const [current, setCurrent] = useState("blue")

    return (
        <div ref={ref} className="grid gap-y-24">
            {/* project header */}

            {projects.map((project, i) => (
                <div
                    key={project.id}
                    className="grid gap-x-4 gap-y-8 desktop:grid-cols-2 items-center desktop:h-screen desktop:min-h-[900px]"
                >
                    <Anchor id={project.id} callback={setCurrent}>
                        <ProjectView project={project} />
                    </Anchor>

                    {i == 0 && (
                        <ProjectStickyAnimationContainerView height={geometry.height}>
                            {projects.map(project => (
                                <ProjectStickyAnimationView
                                    key={project.id}
                                    displayed={current == project.id}
                                    project={project.artwork}
                                />
                            ))}
                        </ProjectStickyAnimationContainerView>
                    )}

                    <div className="desktop:hidden">
                        <ProjectAnimationView type="standalone" color="red" />
                    </div>
                </div>
            ))}
        </div>
    )
}
