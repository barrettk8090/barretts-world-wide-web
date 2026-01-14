import type { Project } from "../pages/Projects/Projects"

interface SingleProjectProps{
    project: Project
}


export default function ProjectModule({ project }: SingleProjectProps){

    return (
        <div className="single-project">
            <p>{project.name}</p>
            <p>{project.company}</p>
            <p>{project.description}</p>

            {/* If proj has link, check it out link */}
            { project.link ? 
            <a href={project.link}>Check it</a> : <></>
        }
        </div>
    )
}