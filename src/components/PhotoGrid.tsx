import { useEffect, useState } from 'react';
import type { Photo } from '../services/contentful';
import './PhotoGrid.css';

const GRID_URL = (url: string) => `${url}?w=1200&fm=webp&q=80`;

const SRCSET_WIDTHS = [640, 960, 1280, 1600, 2000];
const SRCSET = (url: string) =>
  SRCSET_WIDTHS.map((w) => `${url}?w=${w}&fm=webp&q=80 ${w}w`).join(', ');
// Desktop photos sit in the viewport minus the rail and the stream padding
const SIZES = '(min-width: 900px) calc(100vw - 344px), 100vw';

function useColumnCount(): number {
  const getCount = () => {
    if (window.innerWidth <= 520) return 1;
    if (window.innerWidth < 900) return 2;
    return 1; // desktop is a single large stream beside the left rail
  };
  const [count, setCount] = useState(getCount);
  useEffect(() => {
    const onResize = () => setCount(getCount());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return count;
}

interface PhotoGridProps {
  photos: Photo[];
  loading: boolean;
  emptyMessage?: string;
}

export default function PhotoGrid({ photos, loading, emptyMessage = 'Photos coming soon.' }: PhotoGridProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const columnCount = useColumnCount();

  if (loading) return <div className="photo-loading" />;

  if (photos.length === 0) {
    return (
      <div className="photo-empty">
        <p>{emptyMessage}</p>
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
          <span className="photo-filters-label">tags</span>
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
            {col.map((photo, i) => (
              <div key={photo.id} className="photo-grid-item">
                <img
                  src={GRID_URL(photo.imageUrl)}
                  srcSet={SRCSET(photo.imageUrl)}
                  sizes={SIZES}
                  width={photo.width}
                  height={photo.height}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  alt={photo.caption || photo.title}
                  className="photo-grid-img"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
