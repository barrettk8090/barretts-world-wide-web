import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';
import { getAbout } from '../../services/contentful';
import type { About as AboutType } from '../../services/contentful';
import './About.css';

export default function About() {
  const [about, setAbout] = useState<AboutType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAbout()
      .then(setAbout)
      .catch((err) => console.error('Error loading about:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="about-container" />;
  }

  if (!about) {
    return (
      <div className="about-container">
        <p>Coming soon.</p>
      </div>
    );
  }

  return (
    <div className="about-container">
      {about.photoUrl && (
        <img src={about.photoUrl} alt={about.name} className="about-photo" />
      )}
      <h1 className="about-name">{about.name}</h1>
      <div className="about-body">
        {documentToReactComponents(about.body as Document)}
      </div>
    </div>
  );
}
