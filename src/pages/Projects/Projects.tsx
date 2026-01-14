import ProjectModule from "../../components/ProjectModule"


export interface Project {
    name: string,
    link?: string,
    company?: string,
    description?: string,
}

const projects: Array<Project> = [
    {
        name: "PocketTelemetry",
        link: "",
        company: "DIMO",
        description: "Built over the couse of a single weekend, I developed PocketTelemetry on my own time to solve a common problem amoungst the DIMO engineering team:  "
    },
    {
        name: "DIMO Python SDK",
        link: "",
        company: "DIMO",
        description: "Built before I started at DIMO, I cotributed to open source by developing an SDK in Python."
    },
    {
        name: "Unnamed Standby Project",
        description: "Building a beautiful iOS app to serve as a Standby mode replacement that also functions as a personal assistant."
    }
]

export default function Projects(){


    return(
        <div>
            <h1>projects</h1>
            <p>These are some of the programming projects ive worked on recently:</p>

            {projects.map((project, index) => (
                <ProjectModule key={project.name || index} project={project} />
            ))}
        </div>
    )
}