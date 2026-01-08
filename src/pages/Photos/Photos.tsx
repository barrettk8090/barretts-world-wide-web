import { useEffect, useState } from 'react';
import { listAllImages } from '../../services/cloudflareImageFetch';
import type { CloudflareImage } from '../../services/cloudflareImageFetch';
import './Photos.css';

export default function Photos() {
  const [images, setImages] = useState<CloudflareImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAllImages()
      .then((data) => {
        console.log('Images received:', data);
        setImages(data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>my camera roll :)</h1>
      { images && (
        <div className="photo-stream">
            {images.map((singleImage, index) => 
                <img 
                  key={singleImage.id || index} 
                  src={singleImage.variants?.[0] ?? String(singleImage.variants)} 
                  alt={singleImage.filename}
                  className="photo-post"
                />
            )}
        </div>    
      )}
    </div>
  );
}