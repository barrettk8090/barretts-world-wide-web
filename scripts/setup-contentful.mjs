/**
 * Script to create/update Contentful content models.
 * Run: CONTENTFUL_CMA_TOKEN=<token> node scripts/setup-contentful.mjs
 */

const SPACE_ID = 'bk6yzp9jc9r3';
const ENVIRONMENT = 'master';
const CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN;

if (!CMA_TOKEN) {
  console.error('Set CONTENTFUL_CMA_TOKEN environment variable');
  process.exit(1);
}

const BASE = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

const headers = {
  Authorization: `Bearer ${CMA_TOKEN}`,
  'Content-Type': 'application/vnd.contentful.management.v1+json',
};

async function getContentType(id) {
  const res = await fetch(`${BASE}/content_types/${id}`, { headers });
  if (res.ok) return res.json();
  return null;
}

async function deleteAllEntries(contentTypeId) {
  console.log(`  Deleting entries for ${contentTypeId}...`);
  const res = await fetch(`${BASE}/entries?content_type=${contentTypeId}&limit=100`, { headers });
  if (!res.ok) return;
  const data = await res.json();
  for (const entry of data.items) {
    // Unpublish first if published
    if (entry.sys.publishedVersion) {
      await fetch(`${BASE}/entries/${entry.sys.id}/published`, {
        method: 'DELETE',
        headers: { ...headers, 'X-Contentful-Version': String(entry.sys.version) },
      });
      // Re-fetch to get updated version
      const updated = await fetch(`${BASE}/entries/${entry.sys.id}`, { headers });
      const updatedEntry = await updated.json();
      await fetch(`${BASE}/entries/${entry.sys.id}`, {
        method: 'DELETE',
        headers: { ...headers, 'X-Contentful-Version': String(updatedEntry.sys.version) },
      });
    } else {
      await fetch(`${BASE}/entries/${entry.sys.id}`, {
        method: 'DELETE',
        headers: { ...headers, 'X-Contentful-Version': String(entry.sys.version) },
      });
    }
  }
  console.log(`  Deleted ${data.items.length} entries.`);
}

async function deleteContentType(id) {
  const existing = await getContentType(id);
  if (!existing) return;

  console.log(`Deleting content type: ${id}...`);

  // Delete all entries first
  await deleteAllEntries(id);

  // Unpublish
  await fetch(`${BASE}/content_types/${id}/published`, {
    method: 'DELETE',
    headers: { ...headers, 'X-Contentful-Version': String(existing.sys.version) },
  });

  // Re-fetch for updated version
  const refetched = await getContentType(id);
  if (refetched) {
    await fetch(`${BASE}/content_types/${id}`, {
      method: 'DELETE',
      headers: { ...headers, 'X-Contentful-Version': String(refetched.sys.version) },
    });
  }
  console.log(`  ${id} deleted.`);
}

async function createContentType(id, data) {
  console.log(`Creating content type: ${id}...`);

  const res = await fetch(`${BASE}/content_types/${id}`, {
    method: 'PUT',
    headers: { ...headers, 'X-Contentful-Version': '0' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    if (res.status === 409) {
      console.log(`  ${id} already exists, skipping.`);
      return;
    }
    const err = await res.text();
    console.error(`  Failed to create ${id}: ${res.status} ${err}`);
    return;
  }

  const created = await res.json();
  const version = created.sys.version;

  const activateRes = await fetch(`${BASE}/content_types/${id}/published`, {
    method: 'PUT',
    headers: { ...headers, 'X-Contentful-Version': String(version) },
  });

  if (activateRes.ok) {
    console.log(`  ${id} created and activated.`);
  } else {
    const err = await activateRes.text();
    console.error(`  Failed to activate ${id}: ${activateRes.status} ${err}`);
  }
}

// --- Content Type Definitions ---

const photo = {
  name: 'Photo',
  displayField: 'title',
  fields: [
    {
      id: 'title',
      name: 'Title',
      type: 'Symbol',
      required: true,
    },
    {
      id: 'image',
      name: 'Image',
      type: 'Link',
      linkType: 'Asset',
      required: true,
    },
    {
      id: 'caption',
      name: 'Caption',
      type: 'Symbol',
      required: false,
    },
    {
      id: 'tags',
      name: 'Tags',
      type: 'Array',
      required: false,
      items: { type: 'Symbol' },
    },
  ],
};

const photostream = {
  name: 'Photostream',
  displayField: 'title',
  fields: [
    {
      id: 'title',
      name: 'Title',
      type: 'Symbol',
      required: true,
    },
    {
      id: 'slug',
      name: 'Slug',
      type: 'Symbol',
      required: false,
      validations: [{ unique: true }],
    },
    {
      id: 'description',
      name: 'Description',
      type: 'Text',
      required: false,
    },
    {
      id: 'photos',
      name: 'Photos',
      type: 'Array',
      required: false,
      items: {
        type: 'Link',
        linkType: 'Entry',
        validations: [
          {
            linkContentType: ['photo'],
          },
        ],
      },
    },
  ],
};

const blogPost = {
  name: 'Blog Post',
  displayField: 'title',
  fields: [
    {
      id: 'title',
      name: 'Title',
      type: 'Symbol',
      required: true,
    },
    {
      id: 'slug',
      name: 'Slug',
      type: 'Symbol',
      required: true,
      validations: [{ unique: true }],
    },
    {
      id: 'date',
      name: 'Date',
      type: 'Date',
      required: true,
    },
    {
      id: 'body',
      name: 'Body',
      type: 'RichText',
      required: true,
    },
    {
      id: 'featuredImage',
      name: 'Featured Image',
      type: 'Link',
      linkType: 'Asset',
      required: false,
    },
    {
      id: 'tags',
      name: 'Tags',
      type: 'Array',
      required: false,
      items: { type: 'Symbol' },
    },
  ],
};

const experience = {
  name: 'Experience',
  displayField: 'role',
  fields: [
    {
      id: 'role',
      name: 'Role',
      type: 'Symbol',
      required: true,
    },
    {
      id: 'company',
      name: 'Company',
      type: 'Symbol',
      required: true,
    },
    {
      id: 'companyUrl',
      name: 'Company URL',
      type: 'Symbol',
      required: false,
    },
    {
      id: 'description',
      name: 'Description',
      type: 'Text',
      required: false,
    },
    {
      id: 'startYear',
      name: 'Start Year',
      type: 'Integer',
      required: true,
    },
    {
      id: 'endYear',
      name: 'End Year',
      type: 'Integer',
      required: false,
    },
    {
      id: 'order',
      name: 'Order',
      type: 'Integer',
      required: true,
    },
  ],
};

const project = {
  name: 'Project',
  displayField: 'name',
  fields: [
    {
      id: 'name',
      name: 'Name',
      type: 'Symbol',
      required: true,
    },
    {
      id: 'company',
      name: 'Company',
      type: 'Symbol',
      required: false,
    },
    {
      id: 'description',
      name: 'Description',
      type: 'Text',
      required: false,
    },
    {
      id: 'link',
      name: 'Link',
      type: 'Symbol',
      required: false,
    },
    {
      id: 'githubUrl',
      name: 'GitHub URL',
      type: 'Symbol',
      required: false,
    },
    {
      id: 'order',
      name: 'Order',
      type: 'Integer',
      required: true,
    },
  ],
};

async function main() {
  // Delete old photo type (has order field we're removing)
  await deleteContentType('photo');

  // Create all content types
  await createContentType('photo', photo);
  await createContentType('photostream', photostream);
  await createContentType('blogPost', blogPost);
  await createContentType('experience', experience);
  await createContentType('project', project);

  console.log('\nDone! Content models are set up in Contentful.');
  console.log('\nWorkflow:');
  console.log('1. Create Photo entries (each with a title, image asset, optional caption/tags)');
  console.log('2. Create a Photostream entry per stream (slug: home/people/places/things/climate/archive),');
  console.log('   drag-and-drop Photo references in order, and fill in a Title/Description');
  console.log('3. Each page fetches its Photostream by slug and displays photos in that order');
}

main().catch(console.error);
