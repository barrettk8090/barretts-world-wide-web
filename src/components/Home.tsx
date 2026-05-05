import { useEffect, useState } from 'react';
import { getPhotostreamPhotos } from '../services/contentful';
import type { Photo } from '../services/contentful';
import './Home.css';

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
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

  return (
    <div className="photo-feed">
      {photos.map((photo) => (
        <div key={photo.id} className="photo-slide">
          <img
            src={`${photo.imageUrl}?w=1920&fm=webp&q=85`}
            alt={photo.caption || photo.title}
            className="photo-slide-img"
          />
        </div>
      ))}
    </div>
  );
}
