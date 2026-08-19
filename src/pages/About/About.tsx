import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import type { Block, Inline, Document } from '@contentful/rich-text-types';
import { getAbout } from '../../services/contentful';
import type { About as AboutType } from '../../services/contentful';
import './About.css';

// Contentful's default renderer drops embedded assets unless we tell it how
// to render them, so images placed inline in the About body were vanishing.
const richTextOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => {
      const file = node.data.target?.fields?.file;
      const title = node.data.target?.fields?.title ?? '';
      const description = node.data.target?.fields?.description;
      if (!file?.url) return null;
      return (
        <img
          src={`https:${file.url}`}
          alt={description || title}
          className="about-body-image"
        />
      );
    },
  },
};

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
        {documentToReactComponents(about.body as Document, richTextOptions)}
      </div>
    </div>
  );
}
