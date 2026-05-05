import { useEffect, useState, useCallback } from 'react';
import { listAllImages } from '../../services/cloudflareImageFetch';
import type { CloudflareImage } from '../../services/cloudflareImageFetch';
import './Photography.css';

export default function Photography() {
  const [images, setImages] = useState<CloudflareImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    listAllImages()
      .then((data) => {
        setImages(data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const professionalPhotos = images.filter(
    (img) => img.meta?.category === 'professional'
  );

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  const goToPrevious = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const goToNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < professionalPhotos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, professionalPhotos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext]);

  const handleImageLoad = (id: string) => {
    setImageLoaded(prev => ({ ...prev, [id]: true }));
  };

  if (loading) {
    return (
      <div className="photography-page">
        <div className="photography-loading">
          <div className="loading-spinner" />
          <p>Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="photography-page">
        <div className="photography-error">
          <p>Unable to load images</p>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const selectedImage = selectedIndex !== null ? professionalPhotos[selectedIndex] : null;

  return (
    <div className="photography-page">
      <header className="photography-header">
        <h1>Photography</h1>
      </header>

      {professionalPhotos.length > 0 ? (
        <div className="photography-gallery">
          {professionalPhotos.map((image, index) => (
            <button
              key={image.id || index}
              className={`gallery-item ${imageLoaded[image.id] ? 'loaded' : ''}`}
              onClick={() => openLightbox(index)}
              aria-label={`View ${image.meta?.alt_text || image.filename}`}
            >
              <div className="gallery-item-placeholder" />
              <img
                src={image.variants?.[0] ?? String(image.variants)}
                alt={image.meta?.alt_text || image.filename}
                loading="lazy"
                onLoad={() => handleImageLoad(image.id)}
              />
              <div className="gallery-item-overlay">
                <span className="view-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="photography-empty">
          <p>No photographs available yet.</p>
        </div>
      )}

      {selectedImage && selectedIndex !== null && (
        <div 
          className="lightbox-overlay" 
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="lightbox-close" 
              onClick={closeLightbox}
              aria-label="Close viewer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              className="lightbox-nav lightbox-prev"
              onClick={goToPrevious}
              disabled={selectedIndex === 0}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="lightbox-image-container">
              <img
                src={selectedImage.variants?.[0] ?? String(selectedImage.variants)}
                alt={selectedImage.meta?.alt_text || selectedImage.filename}
              />
            </div>

            <button
              className="lightbox-nav lightbox-next"
              onClick={goToNext}
              disabled={selectedIndex === professionalPhotos.length - 1}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="lightbox-info">
              <span className="lightbox-counter">
                {selectedIndex + 1} / {professionalPhotos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
