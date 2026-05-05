import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { parseFrontmatter } from '../utils/contentLoader';
import type { Post } from '../utils/contentLoader';

export function PersonalBlogPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const postModules = import.meta.glob('/content/personal-blog/*.md', { 
        as: 'raw'
      });

      const loadedPosts: Post[] = [];

      for (const [path, loadPost] of Object.entries(postModules)) {
        const content = await loadPost() as string;
        const { data, content: body } = parseFrontmatter(content);
        const slug = path.split('/').pop()?.replace('.md', '') || '';

        loadedPosts.push({
          slug,
          title: data.title || 'Untitled',
          date: data.date || '',
          body,
          featuredImage: data.featuredImage,
          tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
        });
      }

      loadedPosts.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setPosts(loadedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  if (loading) {
    return <div className="blog-list-container">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="blog-list-container">
        <p>No posts yet! Create your first post at <code>/admin</code></p>
      </div>
    );
  }

  return (
    <div className="blog-list-container">
      <h1>blog</h1>
      <ul className="blog-list">
        {posts.map(post => (
          <li key={post.slug} className="blog-list-item">
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