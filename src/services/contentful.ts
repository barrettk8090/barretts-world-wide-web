import { createClient } from 'contentful';
import type { EntryFieldTypes } from 'contentful';

const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_DELIVERY_TOKEN,
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
});

// --- Photo ---

interface PhotoSkeleton {
  contentTypeId: 'photo';
  fields: {
    title: EntryFieldTypes.Symbol;
    image: EntryFieldTypes.AssetLink;
    caption?: EntryFieldTypes.Symbol;
    tags?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  };
}

export interface Photo {
  id: string;
  title: string;
  imageUrl: string;
  caption?: string;
  tags?: string[];
  width?: number;
  height?: number;
}

// --- Photostream ---

interface PhotostreamSkeleton {
  contentTypeId: 'photostream';
  fields: {
    title: EntryFieldTypes.Symbol;
    slug?: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    photos?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<PhotoSkeleton>>;
  };
}

export interface Photostream {
  id: string;
  title: string;
  slug: string;
  description?: string;
  photos: Photo[];
}

function parsePhotoRefs(photoRefs: unknown[] | undefined): Photo[] {
  if (!photoRefs) return [];

  return photoRefs
    .filter((ref): ref is { sys: { id: string }; fields: Record<string, unknown> } =>
      typeof ref === 'object' && ref !== null && 'fields' in ref
    )
    .map((entry) => {
      const fields = entry.fields as {
        title: string;
        image: {
          fields?: {
            file?: {
              url?: string;
              details?: { image?: { width?: number; height?: number } };
            };
          };
          sys?: { type: string };
        };
        caption?: string;
        tags?: string[];
      };

      // Contentful built-in taxonomy tags live on entry.metadata.tags
      const metadataTags = (entry as unknown as {
        metadata?: { tags?: { sys: { id: string } }[] };
      }).metadata?.tags?.map((t) => t.sys.id) ?? [];

      // Custom tags field on the Photo content type
      const fieldTags = fields.tags ?? [];

      // Merge both, deduplicate
      const tags = Array.from(new Set([...metadataTags, ...fieldTags]));

      let imageUrl = '';
      if (fields.image && 'fields' in fields.image && fields.image.fields?.file?.url) {
        imageUrl = `https:${fields.image.fields.file.url}`;
      }

      const dimensions = fields.image?.fields?.file?.details?.image;

      return {
        id: entry.sys.id,
        title: fields.title,
        imageUrl,
        caption: fields.caption,
        tags: tags.length > 0 ? tags : undefined,
        width: dimensions?.width,
        height: dimensions?.height,
      };
    });
}

/** Fetches a single named photostream (e.g. "home", "people", "places") by its slug. */
export async function getPhotostream(slug: string): Promise<Photostream | null> {
  const response = await client.getEntries<PhotostreamSkeleton>({
    content_type: 'photostream',
    'fields.slug': slug,
    include: 3,
    limit: 1,
  });

  if (response.items.length === 0) return null;

  const entry = response.items[0];
  const fields = entry.fields as unknown as {
    title: string;
    slug?: string;
    description?: string;
    photos?: unknown[];
  };

  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug ?? slug,
    description: fields.description,
    photos: parsePhotoRefs(fields.photos),
  };
}

export async function getPhotostreamPhotos(): Promise<Photo[]> {
  const stream = await getPhotostream('home');
  return stream?.photos ?? [];
}

// --- Blog Post ---

interface BlogPostSkeleton {
  contentTypeId: 'blogPost';
  fields: {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    date: EntryFieldTypes.Date;
    body: EntryFieldTypes.RichText;
    featuredImage?: EntryFieldTypes.AssetLink;
    tags?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  body: unknown;
  featuredImageUrl?: string;
  tags?: string[];
}

function parseBlogEntry(entry: { sys: { id: string }; fields: Record<string, unknown> }): BlogPost {
  const fields = entry.fields as {
    title: string;
    slug: string;
    date: string;
    body: unknown;
    featuredImage?: { fields?: { file?: { url?: string } } };
    tags?: string[];
  };

  const featuredImageUrl = fields.featuredImage?.fields?.file?.url
    ? `https:${fields.featuredImage.fields.file.url}`
    : undefined;

  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    date: fields.date,
    body: fields.body,
    featuredImageUrl,
    tags: fields.tags,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const response = await client.getEntries<BlogPostSkeleton>({
    content_type: 'blogPost',
    order: ['-fields.date'],
    limit: 100,
  });

  return response.items.map(parseBlogEntry);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const response = await client.getEntries<BlogPostSkeleton>({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
  });

  if (response.items.length === 0) return null;
  return parseBlogEntry(response.items[0]);
}

// --- Experience ---

interface ExperienceSkeleton {
  contentTypeId: 'experience';
  fields: {
    role: EntryFieldTypes.Symbol;
    company: EntryFieldTypes.Symbol;
    companyUrl?: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    startYear: EntryFieldTypes.Integer;
    endYear?: EntryFieldTypes.Integer;
    order: EntryFieldTypes.Integer;
  };
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  description?: string;
  startYear: number;
  endYear?: number;
  order: number;
}

export async function getExperiences(): Promise<Experience[]> {
  const response = await client.getEntries<ExperienceSkeleton>({
    content_type: 'experience',
    order: ['fields.order'],
    limit: 100,
  });

  return response.items.map((entry) => ({
    id: entry.sys.id,
    role: entry.fields.role,
    company: entry.fields.company,
    companyUrl: entry.fields.companyUrl,
    description: entry.fields.description,
    startYear: entry.fields.startYear,
    endYear: entry.fields.endYear,
    order: entry.fields.order,
  }));
}

// --- Project ---

interface ProjectSkeleton {
  contentTypeId: 'project';
  fields: {
    name: EntryFieldTypes.Symbol;
    company?: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.Text;
    link?: EntryFieldTypes.Symbol;
    githubUrl?: EntryFieldTypes.Symbol;
    order: EntryFieldTypes.Integer;
  };
}

export interface Project {
  id: string;
  name: string;
  company?: string;
  description?: string;
  link?: string;
  githubUrl?: string;
  order: number;
}

export async function getProjects(): Promise<Project[]> {
  const response = await client.getEntries<ProjectSkeleton>({
    content_type: 'project',
    order: ['fields.order'],
    limit: 100,
  });

  return response.items.map((entry) => ({
    id: entry.sys.id,
    name: entry.fields.name,
    company: entry.fields.company,
    description: entry.fields.description,
    link: entry.fields.link,
    githubUrl: entry.fields.githubUrl,
    order: entry.fields.order,
  }));
}

// --- Video ---

interface VideoSkeleton {
  contentTypeId: '64zkKNNThTr2nmDUvyOp3T';
  fields: {
    title: EntryFieldTypes.Symbol;
    videoUrl: EntryFieldTypes.Symbol;
    caption?: EntryFieldTypes.Symbol;
    tags?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    order?: EntryFieldTypes.Integer;
  };
}

export interface Video {
  id: string;
  title: string;
  videoUrl: string;
  caption?: string;
  tags?: string[];
  order?: number;
}

export async function getVideos(): Promise<Video[]> {
  const response = await client.getEntries<VideoSkeleton>({
    content_type: '64zkKNNThTr2nmDUvyOp3T',
    order: ['fields.order'],
    limit: 100,
  });

  return response.items.map((entry) => {
    const fields = entry.fields as unknown as {
      title: string;
      videoUrl: string;
      caption?: string;
      tags?: string[];
      order?: number;
    };
    return {
      id: entry.sys.id,
      title: fields.title,
      videoUrl: fields.videoUrl,
      caption: fields.caption,
      tags: fields.tags,
      order: fields.order,
    };
  });
}

// --- Video Page ---

interface VideoPageSkeleton {
  contentTypeId: '5A0OkEcgBtZVJHn0ad7K6J';
  fields: {
    intro: EntryFieldTypes.Symbol;
  };
}

export async function getVideoPageIntro(): Promise<string | null> {
  const response = await client.getEntries<VideoPageSkeleton>({
    content_type: '5A0OkEcgBtZVJHn0ad7K6J',
    limit: 1,
  });
  if (response.items.length === 0) return null;
  return (response.items[0].fields as unknown as { intro: string }).intro;
}

// --- About ---

interface AboutSkeleton {
  contentTypeId: 'about';
  fields: {
    name: EntryFieldTypes.Symbol;
    bio?: EntryFieldTypes.Symbol;
    body: EntryFieldTypes.RichText;
    photo?: EntryFieldTypes.AssetLink;
  };
}

/** Short bio shown in the nav rail. Fetched on its own so the header
 *  doesn't have to pull down the whole About rich text body. */
export async function getSiteBio(): Promise<string | null> {
  const response = await client.getEntries<AboutSkeleton>({
    content_type: 'about',
    limit: 1,
    select: ['fields.bio'],
  });

  if (response.items.length === 0) return null;

  const fields = response.items[0].fields as unknown as { bio?: string };
  return fields.bio ?? null;
}

export interface About {
  id: string;
  name: string;
  body: unknown;
  photoUrl?: string;
}

export async function getAbout(): Promise<About | null> {
  const response = await client.getEntries<AboutSkeleton>({
    content_type: 'about',
    limit: 1,
  });

  if (response.items.length === 0) return null;

  const entry = response.items[0];
  const fields = entry.fields as unknown as {
    name: string;
    body: unknown;
    photo?: { fields?: { file?: { url?: string } } };
  };

  const photoUrl = fields.photo?.fields?.file?.url
    ? `https:${fields.photo.fields.file.url}`
    : undefined;

  return {
    id: entry.sys.id,
    name: fields.name,
    body: fields.body,
    photoUrl,
  };
}
