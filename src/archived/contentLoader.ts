export interface Post {
    slug: string;
    title: string;
    date: string;
    body: string;
    featuredImage?: string;
    image?: string;
    tags?: string[];
    description?: string;
    location?: string;
    exif?: string;
  }
  
  // Define what frontmatter data can contain
  export interface FrontmatterData {
    title?: string;
    date?: string;
    featuredImage?: string;
    image?: string;
    tags?: string;
    description?: string;
    location?: string;
    exif?: string;
    [key: string]: string | undefined;  // Allow other string keys
  }
  
  export function parseFrontmatter(markdown: string): { data: FrontmatterData; content: string } {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
  
    if (!match) {
      return { data: {}, content: markdown };
    }
  
    const frontmatter = match[1];
    const content = match[2];
  
    const data: FrontmatterData = {};
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim();
        data[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    });
  
    return { data, content: content.trim() };
  }