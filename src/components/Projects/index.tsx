import projects from "./projects.json"

import Project from "../Projects/Project"
import { H2 } from "../Text"

export default function Projects() {
    return (
        <>
            <H2 style={{ maxWidth: "750px", margin: "auto" }}>Here are some of my projects</H2>
            { projects.map(project => <Project key={project.title} { ...project } />) }
        </>
    )   
}
