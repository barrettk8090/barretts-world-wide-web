import './Projects.css'
import ProjectModule from "../../components/ProjectModule"
import Experience from '../../components/Experience'


export interface Project {
    name: string,
    link?: string,
    company?: string,
    description?: string,
}

const projects: Array<Project> = [
    {
        name: "PocketTelemetry",
        link: "https://github.com/barrettk8090/pocket-telemetry",
        company: "DIMO",
        description: "Built over the course of a single weekend, I developed PocketTelemetry on my own time to solve a common problem amongst the DIMO engineering team: Difficulty in querying the Telemetry API when AFK (AKA, on mobile 📱). PocketTelemetry allows the DIMO engineering team (and anyone else!) to 'tap-to-query' using their developer creds while on-the-go." 
    },
    {
        name: "DIMO Python SDK",
        link: "https://github.com/DIMO-Network/dimo-python-sdk",
        company: "DIMO",
        description: "Built before I worked at DIMO, I developed an open source data SDK in Python, allowing developers to easily interact with DIMO APIs. During my time at DIMO, I continued to iterate and improve the SDK with unit testing, additional APIs, and now, a full integration with an intelligent, stateful vehicle AI agent."
    },
    {
        name: "Unnamed Standby Project",
        description: "Building a beautiful iOS app to serve as a Standby mode replacement that also functions as a personal assistant."
    },
    {
        name: "Barretts World Wide Web",
        link:"https://github.com/barrettk8090/barretts-world-wide-web",
        description: "This website. A personal little space on the internet to grow with, and into. 🌱"
    }
]

export default function Projects(){


    return(
        <div>
            <Experience/>
            <h1>projects</h1>
            <p>These are some of the programming projects I've worked on recently (more soon):</p>
            <div className="project-container">
                    {projects.map((project, index) => (
                        <ProjectModule key={project.name || index} project={project} />
                    ))}
            </div>
        </div>
    )
}