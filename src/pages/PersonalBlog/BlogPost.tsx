import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { parseFrontmatter } from '../../utils/contentLoader';
import type { Post } from '../../utils/contentLoader';
import './BlogPost.css';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        const postModules = import.meta.glob('/content/personal-blog/*.md', {
          as: 'raw'
        });

        for (const [path, loadPostContent] of Object.entries(postModules)) {
          const postSlug = path.split('/').pop()?.replace('.md', '') || '';
          
          if (postSlug === slug) {
            const content = await loadPostContent() as string;
            const { data, content: body } = parseFrontmatter(content);

            setPost({
              slug: postSlug,
              title: data.title || 'Untitled',
              date: data.date || '',
              body,
              featuredImage: data.featuredImage,
              tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
            });
            setLoading(false);
            return;
          }
        }

        setError('Post not found');
        setLoading(false);
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Error loading post');
        setLoading(false);
      }
    }

    loadPost();
  }, [slug]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  if (loading) {
    return (
      <div className="blog-post-container">
        <div className="blog-post-loading">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-container">
        <div className="blog-post-error">
          <h1>Post Not Found</h1>
          <p>Sorry, we couldn't find the post you're looking for.</p>
          <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      <article className="blog-post">
        <header className="blog-post-header">
          <Link to="/blog" className="back-to-blog">← Back to Blog</Link>
          <h1 className="blog-post-title">{post.title}</h1>
          <time className="blog-post-date">{formatDate(post.date)}</time>
        </header>

        {post.featuredImage && (
          <img 
            src={post.featuredImage} 
            alt={post.title} 
            className="blog-post-featured-image"
          />
        )}

        <div className="blog-post-content">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>

        {post.tags && post.tags.length > 0 && (
          <footer className="blog-post-footer">
            <div className="blog-post-tags">
              {post.tags.map(tag => (
                <span key={tag} className="blog-post-tag">{tag}</span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}
