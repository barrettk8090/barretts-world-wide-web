import { useEffect, useState } from 'react';
import { parseFrontmatter } from '../utils/contentLoader';
import type { Post } from '../utils/contentLoader';

export function PhotoStream() {
  const [photos, setPhotos] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    try {
      const photoModules = import.meta.glob('/content/photos/*.md', { 
        as: 'raw'
      });

      const loadedPhotos: Post[] = [];

      for (const [path, loadPhoto] of Object.entries(photoModules)) {
        const content = await loadPhoto() as string;
        const { data, content: body } = parseFrontmatter(content);
        const slug = path.split('/').pop()?.replace('.md', '') || '';

        loadedPhotos.push({
          slug,
          title: data.title || '',
          date: data.date || '',
          body,
          image: data.image,
          description: data.description,
          location: data.location,
          exif: data.exif,
        });
      }

      // Sort by date, newest first
      loadedPhotos.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setPhotos(loadedPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading photos...</div>;
  }

  if (photos.length === 0) {
    return (
      <div>
        <p>Photos are MIA... rip 💀</p>
      </div>
    );
  }

  return (
    <div className="photo-stream">
      <h1>los photos</h1>
      <div className="photo-grid">
        {photos.map(photo => (
          <div key={photo.slug} className="photo-item">
            {photo.image && (
              <img className="photo-post"src={photo.image} alt={photo.title || 'Photo'} />
            )}
            {/* HIDDEN: PHOTO TITLES {photo.title && <h3>{photo.title}</h3>} */}
            {photo.description && <p>{photo.description}</p>}
            <time>{new Date(photo.date).toLocaleDateString()}</time>
            {photo.location && <span className="location">📍 {photo.location}</span>}
            {photo.exif && <details className="exif"><summary>Camera Info</summary>{photo.exif}</details>}
          </div>
        ))}
      </div>
    </div>
  );
}