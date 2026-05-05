import { useEffect, useState } from 'react';
import { getExperiences, getProjects } from '../../services/contentful';
import type { Experience, Project } from '../../services/contentful';
import './CV.css';

export default function CV() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getExperiences(), getProjects()])
      .then(([exp, proj]) => {
        setExperiences(exp);
        setProjects(proj);
      })
      .catch((err) => console.error('Error loading CV data:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="cv-container"><p>Loading...</p></div>;
  }

  return (
    <div className="cv-container">
      <section className="cv-section">
        <h1>career</h1>
        {experiences.length > 0 ? (
          <ul className="cv-experience-list">
            {experiences.map((exp) => (
              <li key={exp.id}>
                {exp.role}
                {exp.companyUrl ? (
                  <> @ <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer">{exp.company}</a></>
                ) : (
                  <> @ {exp.company}</>
                )}
                {' | '}
                {exp.startYear} - {exp.endYear || 'present'}
                {exp.description && <p className="cv-description">{exp.description}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>Experience coming soon.</p>
        )}
      </section>

      <section className="cv-section">
        <h1>projects</h1>
        {projects.length > 0 ? (
          <div className="cv-projects">
            {projects.map((project) => (
              <div key={project.id} className="cv-project">
                <h3>{project.name}</h3>
                {project.description && <p>{project.description}</p>}
                {(project.link || project.githubUrl) && (
                  <div className="cv-project-links">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        Check it out &rarr;
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        GitHub &rarr;
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Projects coming soon.</p>
        )}
      </section>
    </div>
  );
}
