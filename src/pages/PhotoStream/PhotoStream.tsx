import { useEffect, useState } from 'react';
import { getPhotostream } from '../../services/contentful';
import type { Photostream } from '../../services/contentful';
import PhotoGrid from '../../components/PhotoGrid';
import './PhotoStream.css';

interface PhotoStreamProps {
  slug: string;
  fallbackTitle: string;
}

export default function PhotoStream({ slug, fallbackTitle }: PhotoStreamProps) {
  const [stream, setStream] = useState<Photostream | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPhotostream(slug)
      .then(setStream)
      .catch((err) => console.error(`Error loading "${slug}" photostream:`, err))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="stream-page">
      <div className="stream-header">
        <h1 className="stream-title">{stream?.title ?? fallbackTitle}</h1>
        {stream?.description && (
          <p className="stream-description">{stream.description}</p>
        )}
      </div>
      <PhotoGrid photos={stream?.photos ?? []} loading={loading} />
    </div>
  );
}
