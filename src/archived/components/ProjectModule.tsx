import type { Project } from "../pages/Projects/Projects"

interface SingleProjectProps{
    project: Project
}


export default function ProjectModule({ project }: SingleProjectProps){

    return (
        <div className="single-project">
            <h3>{project.name}</h3>
            {/* <p>{project.company}</p> */}
            <p>{project.description}</p>

            {/* If proj has link, check it out link */}
            { project.link ? 
                <button className="button proj-button" onClick={() => window.open(project.link, '_blank')}>
                    Check it out →
                </button> 
            : null}
        </div>
    )
}