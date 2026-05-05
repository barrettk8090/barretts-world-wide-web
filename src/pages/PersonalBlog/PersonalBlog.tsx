import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../../services/contentful';
import type { BlogPost } from '../../services/contentful';
import './PersonalBlog.css';

export default function PersonalBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch((err) => console.error('Error loading posts:', err))
      .finally(() => setLoading(false));
  }, []);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  }

  if (loading) {
    return <div className="blog-list-container">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="blog-list-container">
        <p>No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      <h1>notes</h1>
      <ul className="blog-list">
        {posts.map((post) => (
          <li key={post.id} className="blog-list-item">
            <Link to={`/blog/${post.slug}`} className="blog-list-link">
              <span className="blog-list-title">{post.title}</span>
              <span className="blog-list-separator"> - </span>
              <span className="blog-list-date">{formatDate(post.date)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
