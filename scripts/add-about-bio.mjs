/**
 * Adds a short `bio` field to the About content type and seeds it with a
 * starting value. The bio renders in the left nav rail on desktop.
 *
 * Safe to re-run: the field is only added if missing, and the value is only
 * written if empty.
 *
 * Run: CONTENTFUL_CMA_TOKEN=<token> node scripts/add-about-bio.mjs
 */

const SPACE_ID = 'bk6yzp9jc9r3';
const ENVIRONMENT = 'master';
const CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN;
const LOCALE = 'en-US';
const DEFAULT_BIO = 'Film photographer based in Denver, CO';

if (!CMA_TOKEN) {
  console.error('Set CONTENTFUL_CMA_TOKEN environment variable');
  process.exit(1);
}

const BASE = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

const headers = {
  Authorization: `Bearer ${CMA_TOKEN}`,
  'Content-Type': 'application/vnd.contentful.management.v1+json',
};

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { ...options, headers: { ...headers, ...options.headers } });
  if (!res.ok) {
    throw new Error(`${options.method ?? 'GET'} ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.status === 204 ? null : res.json();
}

async function addBioField() {
  const contentType = await request('/content_types/about');

  if (contentType.fields.some((f) => f.id === 'bio')) {
    console.log('About.bio field already exists, skipping.');
    return;
  }

  contentType.fields.push({
    id: 'bio',
    name: 'Bio',
    type: 'Symbol',
    required: false,
    validations: [{ size: { max: 200 } }],
  });

  const updated = await request('/content_types/about', {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(contentType.sys.version) },
    body: JSON.stringify({
      name: contentType.name,
      displayField: contentType.displayField,
      fields: contentType.fields,
    }),
  });

  await request('/content_types/about/published', {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(updated.sys.version) },
  });

  console.log('About.bio field added and activated.');
}

async function seedBioValue() {
  const { items } = await request('/entries?content_type=about&limit=1');
  const entry = items[0];

  if (!entry) {
    console.log('No About entry found; add the bio text in Contentful directly.');
    return;
  }

  if (entry.fields.bio?.[LOCALE]) {
    console.log(`About entry already has a bio: "${entry.fields.bio[LOCALE]}"`);
    return;
  }

  // Only re-publish if the entry had no unpublished edits of its own, so we
  // never publish someone else's in-progress draft as a side effect.
  const wasPublishedAndClean =
    Boolean(entry.sys.publishedVersion) && entry.sys.version === entry.sys.publishedVersion + 1;

  entry.fields.bio = { [LOCALE]: DEFAULT_BIO };

  const updated = await request(`/entries/${entry.sys.id}`, {
    method: 'PUT',
    headers: {
      'X-Contentful-Version': String(entry.sys.version),
      'X-Contentful-Content-Type': 'about',
    },
    body: JSON.stringify({ fields: entry.fields }),
  });

  console.log(`About entry bio set to "${DEFAULT_BIO}".`);

  if (!wasPublishedAndClean) {
    console.log('Entry had unpublished changes — left as a draft. Publish it in Contentful.');
    return;
  }

  await request(`/entries/${entry.sys.id}/published`, {
    method: 'PUT',
    headers: { 'X-Contentful-Version': String(updated.sys.version) },
  });

  console.log('About entry published.');
}

async function main() {
  await addBioField();
  await seedBioValue();
  console.log('\nDone. Edit the bio any time under Content → About in Contentful.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
