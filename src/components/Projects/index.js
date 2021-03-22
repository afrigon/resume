import projects from './projects.json'

import Project from 'components/Projects/Project'
import { H2 } from 'components/Text'

export default function Projects() {
    return (
        <>
            <H2 style={{ maxWidth: '750px', margin: 'auto' }}>Here are some of my projects</H2>
            { projects.map(project => <Project key={project.title} { ...project } />) }
        </>
    )   
}
