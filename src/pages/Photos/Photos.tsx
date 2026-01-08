// import { PhotoStream } from "../../components/PhotoStream"
import { useEffect, useState } from 'react';
import { listAllImages } from '../../services/cloudflareImageFetch';
import './Photos.css';

export default function Photos() {
  const [images, setImages] = useState<unknown[]>([]);
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
      <h1>my camera roll</h1>
      {/* <pre>{JSON.stringify(images, null, 2)}</pre> */}
      { images && (
        <div>
            {images.map(singleImage => 
                <img src={singleImage.variants}/>
            )}
        </div>    
      )}
    </div>
  );
}