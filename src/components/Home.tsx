import { useEffect, useState } from 'react';
import { getPhotostreamPhotos } from '../services/contentful';
import type { Photo } from '../services/contentful';
import './Home.css';

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPhotostreamPhotos()
      .then(setPhotos)
      .catch((err) => console.error('Error loading photos:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="photo-loading" />;
  }

  if (photos.length === 0) {
    return (
      <div className="photo-empty">
        <p>Photos coming soon.</p>
      </div>
    );
  }

  const allTags = Array.from(
    new Set(photos.flatMap((p) => p.tags ?? []))
  );
  console.log('[Home] photos:', photos.map((p) => ({ title: p.title, tags: p.tags })));

  const visible = activeTag
    ? photos.filter((p) => p.tags?.includes(activeTag))
    : photos;

  function handleTagClick(tag: string) {
    setActiveTag((prev) => (prev === tag ? null : tag));
  }

  return (
    <>
      {allTags.length > 0 && (
        <div className="photo-filters">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`photo-filter-btn${activeTag === tag ? ' active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="photo-feed">
        {visible.map((photo) => (
          <div key={photo.id} className="photo-slide">
            <img
              src={`${photo.imageUrl}?w=1920&fm=webp&q=85`}
              alt={photo.caption || photo.title}
              className="photo-slide-img"
            />
          </div>
        ))}
      </div>
    </>
  );
}
