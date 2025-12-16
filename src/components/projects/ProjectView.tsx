import ChevronSymbol from "../ChevronSymbol"
import useHover from "../../hooks/UseHover"
import { ReactElement } from "react"

export type Project = {
    id: string
    title: string
    subtitle: string
    description: string
    icon?: string
    cta: {
        text: string
        link: string
        type: "github"
    }
    extras?: { title: string; description: string; link: string }[]
    artwork: () => ReactElement
}

interface ProjectViewProps {
    project: Project
}

export default function ProjectView({ project }: ProjectViewProps) {
    const [ref, hovered] = useHover<HTMLAnchorElement>()

    return (
        <section className="flex flex-col gap-y-6 max-tiny:gap-y-3 px-4">
            <header className="grid gap-y-4">
                <h2 className="flex gap-1.5 items-center">
                    {project.icon && <img src={project.icon} className="w-8 inline" />}
                    {project.title}
                </h2>
                <h1>{project.subtitle}</h1>
            </header>

            <div>
                <p>{project.description}</p>
            </div>

            <footer className="grid gap-y-11 max-tiny:gap-y-6">
                <a
                    ref={ref}
                    href={project.cta.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`${project.cta.type} cta justify-self-start`}
                >
                    {project.cta.text}
                    <span className="pl-1.5 inline">
                        <ChevronSymbol hovered={hovered} />
                    </span>
                </a>

                {(project.extras ?? []).length != 0 && (
                    <section>
                        <h1 className="text-xs font-semibold mb-2">See also</h1>

                        <ul className="text-base font-light">
                            {(project.extras ?? []).map((extra, i) => (
                                <li key={i} className="max-tiny:text-xs my-1 max-tiny:my-0">
                                    <a href={extra.link} target="_blank" rel="noreferrer" className="max-tiny:text-xs">
                                        {extra.title}
                                    </a>{" "}
                                    {extra.description}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </footer>
        </section>
    )
}
