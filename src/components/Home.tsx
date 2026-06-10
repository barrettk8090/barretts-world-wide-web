import { useEffect, useState, useCallback } from 'react';
import { getPhotostreamPhotos } from '../services/contentful';
import type { Photo } from '../services/contentful';
import './Home.css';

const LIGHTBOX_URL = (url: string) => `${url}?w=1800&fm=webp&q=90`;
const GRID_URL = (url: string) => `${url}?w=1200&fm=webp&q=80`;

function useColumnCount(): number {
  const getCount = () => {
    if (window.innerWidth <= 520) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  };
  const [count, setCount] = useState(getCount);
  useEffect(() => {
    const onResize = () => setCount(getCount());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return count;
}

function preload(url: string) {
  const img = new Image();
  img.src = url;
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [lightboxReady, setLightboxReady] = useState(false);
  const columnCount = useColumnCount();

  useEffect(() => {
    getPhotostreamPhotos()
      .then(setPhotos)
      .catch((err) => console.error('Error loading photos:', err))
      .finally(() => setLoading(false));
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxPhoto(null);
    setLightboxReady(false);
  }, []);

  // Load full-res in background; show grid thumbnail immediately
  useEffect(() => {
    if (!lightboxPhoto) return;
    setLightboxReady(false);
    const img = new Image();
    img.src = LIGHTBOX_URL(lightboxPhoto.imageUrl);
    img.onload = () => setLightboxReady(true);
  }, [lightboxPhoto]);

  useEffect(() => {
    if (!lightboxPhoto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox();
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxPhoto, closeLightbox]);

  if (loading) return <div className="photo-loading" />;

  if (photos.length === 0) {
    return (
      <div className="photo-empty">
        <p>Photos coming soon.</p>
      </div>
    );
  }

  const allTags = Array.from(new Set(photos.flatMap((p) => p.tags ?? [])));

  const visible = activeTag
    ? photos.filter((p) => p.tags?.includes(activeTag))
    : photos;

  // Distribute round-robin so photos read left-to-right across the grid
  const columns: Photo[][] = Array.from({ length: columnCount }, () => []);
  visible.forEach((photo, i) => columns[i % columnCount].push(photo));

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

      <div className="photo-grid">
        {columns.map((col, ci) => (
          <div key={ci} className="photo-col">
            {col.map((photo) => (
              <div
                key={photo.id}
                className="photo-grid-item"
                onClick={() => setLightboxPhoto(photo)}
                onMouseEnter={() => preload(LIGHTBOX_URL(photo.imageUrl))}
              >
                <img
                  src={GRID_URL(photo.imageUrl)}
                  alt={photo.caption || photo.title}
                  className="photo-grid-img"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {lightboxPhoto && (
        <div className="photo-lightbox" onClick={closeLightbox}>
          <button className="photo-lightbox-close" onClick={closeLightbox} aria-label="Close">
            ×
          </button>
          <img
            src={lightboxReady ? LIGHTBOX_URL(lightboxPhoto.imageUrl) : GRID_URL(lightboxPhoto.imageUrl)}
            alt={lightboxPhoto.caption || lightboxPhoto.title}
            className={`photo-lightbox-img${lightboxReady ? '' : ' photo-lightbox-img--loading'}`}
            onClick={(e) => e.stopPropagation()}
          />
          {lightboxPhoto.caption && (
            <p className="photo-lightbox-caption">{lightboxPhoto.caption}</p>
          )}
        </div>
      )}
    </>
  );
}
