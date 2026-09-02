import { useEffect, useState } from 'react';
import { getPhotostreamPhotos } from '../services/contentful';
import type { Photo } from '../services/contentful';
import PhotoGrid from './PhotoGrid';

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPhotostreamPhotos()
      .then(setPhotos)
      .catch((err) => console.error('Error loading photos:', err))
      .finally(() => setLoading(false));
  }, []);

  return <PhotoGrid photos={photos} loading={loading} />;
}
