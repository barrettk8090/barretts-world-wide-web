import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import type { Block, Inline, Document } from '@contentful/rich-text-types';
import type { ReactNode } from 'react';
import { getBlogPostBySlug } from '../../services/contentful';
import type { BlogPost as BlogPostType } from '../../services/contentful';
import './BlogPost.css';

const richTextOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => {
      const file = node.data.target?.fields?.file;
      const title = node.data.target?.fields?.title ?? '';
      const description = node.data.target?.fields?.description;
      if (!file?.url) return null;
      return (
        <img
          src={`https:${file.url}`}
          alt={description || title}
          className="blog-post-featured-image"
        />
      );
    },
    [INLINES.HYPERLINK]: (node: Block | Inline, children: ReactNode) => {
      return (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
  },
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    getBlogPostBySlug(slug)
      .then((result) => {
        if (!result) {
          setError('Post not found');
        } else {
          setPost(result);
        }
      })
      .catch((err) => {
        console.error('Error loading post:', err);
        setError('Error loading post');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
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
          <Link to="/blog" className="back-to-blog">&larr; Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-container">
      <article className="blog-post">
        <header className="blog-post-header">
          <Link to="/blog" className="back-to-blog">&larr; Back to Blog</Link>
          <h1 className="blog-post-title">{post.title}</h1>
          <time className="blog-post-date">{formatDate(post.date)}</time>
        </header>

        {post.featuredImageUrl && (
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="blog-post-featured-image"
          />
        )}

        <div className="blog-post-content">
          {documentToReactComponents(post.body as Document, richTextOptions)}
        </div>

        {post.tags && post.tags.length > 0 && (
          <footer className="blog-post-footer">
            <div className="blog-post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-post-tag">{tag}</span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </div>
  );
}
