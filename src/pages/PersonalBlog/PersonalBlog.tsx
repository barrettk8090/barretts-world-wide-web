import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../../services/contentful';
import type { BlogPost } from '../../services/contentful';
import './PersonalBlog.css';

// Recursively extract plain text from a Contentful rich text document
function extractText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const n = node as { nodeType?: string; value?: string; content?: unknown[] };
  if (n.nodeType === 'text') return n.value ?? '';
  if (Array.isArray(n.content)) return n.content.map(extractText).join('');
  return '';
}

function getSnippet(body: unknown, maxLength = 160): string {
  const text = extractText(body).replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(' ', maxLength));
}

export default function PersonalBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts()
      .then(setPosts)
      .catch((err) => console.error('Error loading posts:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="blog-list-container" />;
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
      <ul className="blog-list">
        {posts.map((post) => {
          const snippet = getSnippet(post.body);
          return (
            <li key={post.id} className="blog-list-item">
              <Link to={`/blog/${post.slug}`} className="blog-list-link">
                <span className="blog-list-title">{post.title}</span>
                {snippet && (
                  <p className="blog-list-snippet">
                    {snippet}… <span className="blog-list-read-more">Read More →</span>
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
