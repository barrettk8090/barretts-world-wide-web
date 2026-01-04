import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
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

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <div>
        <p>No posts yet! Create your first post at <code>/admin</code></p>
      </div>
    );
  }

  return (
    <div className="blog-posts">
      <h1>bloggy</h1>
      {posts.map(post => (
        <article key={post.slug} className="post">
          <h2>{post.title}</h2>
          <time>{new Date(post.date).toLocaleDateString()}</time>
          {post.featuredImage && (
            <img src={post.featuredImage} alt={post.title} />
          )}
          <div className="post-body">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="tags">
              {post.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}