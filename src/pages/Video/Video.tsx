import { useEffect, useState, useCallback } from 'react';
import { getVideos, getVideoPageIntro } from '../../services/contentful';
import type { Video } from '../../services/contentful';
import './Video.css';

function youtubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function thumbnailUrl(video: Video): string {
  const id = youtubeId(video.videoUrl);
  if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  return '';
}

function embedUrl(video: Video): string {
  const id = youtubeId(video.videoUrl);
  if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
  return video.videoUrl;
}

export default function VideoPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [intro, setIntro] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Video | null>(null);

  useEffect(() => {
    Promise.all([getVideos(), getVideoPageIntro()])
      .then(([vids, introText]) => {
        setVideos(vids);
        setIntro(introText);
      })
      .catch((err) => console.error('Error loading videos:', err))
      .finally(() => setLoading(false));
  }, []);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close]);

  if (loading) return <div className="video-loading" />;

  if (videos.length === 0) {
    return (
      <div className="video-empty">
        {intro && <p className="video-page-intro">{intro}</p>}
        <p>Videos coming soon.</p>
      </div>
    );
  }

  return (
    <>
      <div className="video-list">
        {intro && <p className="video-page-intro">{intro}</p>}

        {videos.map((video) => (
          <div key={video.id} className="video-item" onClick={() => setActive(video)}>
            <div className="video-thumb-wrap">
              <img
                src={thumbnailUrl(video)}
                alt={video.caption || video.title}
                className="video-thumb"
              />
              <div className="video-play-icon">▶</div>
            </div>
            {video.caption && <p className="video-caption">{video.caption}</p>}
          </div>
        ))}
      </div>

      {active && (
        <div className="video-lightbox" onClick={close}>
          <button className="video-lightbox-close" onClick={close} aria-label="Close">×</button>
          <div className="video-embed-wrap" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={embedUrl(active)}
              title={active.title}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="video-embed"
            />
          </div>
          {active.caption && <p className="video-lightbox-caption">{active.caption}</p>}
        </div>
      )}
    </>
  );
}
