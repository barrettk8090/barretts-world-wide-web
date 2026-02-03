import { useEffect, useState } from 'react';
import { listAllImages } from '../../services/cloudflareImageFetch';
import type { CloudflareImage } from '../../services/cloudflareImageFetch';
import './Photography.css';

export default function Photography() {
  const [images, setImages] = useState<CloudflareImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAllImages()
      .then((data) => {
        // console.log('Images received:', data);
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

  const professionalPhotos = images.filter(
    (img) => img.meta?.category === 'professional'
  );

  console.log(professionalPhotos)

  return (
    <>
      <h1>from a camera</h1>
      <div className="container">
      { professionalPhotos.length > 0 && (
        <div className="photo-stream">
            {professionalPhotos.map((singleImage, index) => 
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
    </>
  );
}