/**
 * Migrates the `photostream` content type to support multiple named streams
 * (homepage + People / Places / Things / Climate / Archived), and creates
 * the new stream entries.
 *
 * Run: node --env-file=.env.local scripts/setup-photostreams.mjs
 */

const SPACE_ID = 'bk6yzp9jc9r3';
const ENVIRONMENT = process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';
const CMA_TOKEN = process.env.CONTENTFUL_CMA_TOKEN;
const LOCALE = 'en-US';

if (!CMA_TOKEN) {
  console.error('Set CONTENTFUL_CMA_TOKEN (e.g. via node --env-file=.env.local)');
  process.exit(1);
}

const BASE = `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;
const headers = {
  Authorization: `Bearer ${CMA_TOKEN}`,
  'Content-Type': 'application/vnd.contentful.management.v1+json',
};

const NEW_STREAMS = [
  { slug: 'people', title: 'People' },
  { slug: 'places', title: 'Places' },
  { slug: 'things', title: 'Things' },
  { slug: 'climate', title: 'Climate' },
  { slug: 'archive', title: 'Archive' },
];

async function json(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function updateContentType() {
  const ctRes = await fetch(`${BASE}/content_types/photostream`, { headers });
  const ct = await json(ctRes);

  const hasSlug = ct.fields.some((f) => f.id === 'slug');
  const hasDescription = ct.fields.some((f) => f.id === 'description');

  const fields = ct.fields.map((f) =>
    f.id === 'photos' ? { ...f, required: false } : f
  );

  if (!hasSlug) {
    fields.push({
      id: 'slug',
      name: 'Slug',
      type: 'Symbol',
      required: false,
      validations: [{ unique: true }],
    });
  }

  if (!hasDescription) {
    fields.push({
      id: 'description',
      name: 'Description',
      type: 'Text',
      required: false,
    });
  }

  if (hasSlug && hasDescription && ct.fields.find((f) => f.id === 'photos')?.required === false) {
    console.log('Content type already up to date.');
    return;
  }

  console.log('Updating photostream content type (add slug/description, relax photos.required)...');
  const putRes = await fetch(`${BASE}/content_types/photostream`, {
    method: 'PUT',
    headers: { ...headers, 'X-Contentful-Version': String(ct.sys.version) },
    body: JSON.stringify({ name: ct.name, displayField: ct.displayField, fields }),
  });
  const updated = await json(putRes);
  if (!putRes.ok) {
    console.error('Failed to update content type:', updated);
    process.exit(1);
  }

  const pubRes = await fetch(`${BASE}/content_types/photostream/published`, {
    method: 'PUT',
    headers: { ...headers, 'X-Contentful-Version': String(updated.sys.version) },
  });
  if (!pubRes.ok) {
    console.error('Failed to publish content type:', await json(pubRes));
    process.exit(1);
  }
  console.log('Content type updated and published.');
}

async function getAllPhotostreamEntries() {
  const res = await fetch(`${BASE}/entries?content_type=photostream&limit=100`, { headers });
  const data = await json(res);
  return data.items;
}

async function ensureHomeSlug() {
  const entries = await getAllPhotostreamEntries();
  const missing = entries.filter((e) => !e.fields.slug?.[LOCALE]);

  for (const entry of missing) {
    console.log(`Assigning slug "home" to entry ${entry.sys.id} (${entry.fields.title?.[LOCALE]})...`);
    entry.fields.slug = { [LOCALE]: 'home' };
    const putRes = await fetch(`${BASE}/entries/${entry.sys.id}`, {
      method: 'PUT',
      headers: { ...headers, 'X-Contentful-Version': String(entry.sys.version) },
      body: JSON.stringify({ fields: entry.fields }),
    });
    const updated = await json(putRes);
    if (!putRes.ok) {
      console.error('  Failed to update entry:', updated);
      continue;
    }
    const pubRes = await fetch(`${BASE}/entries/${entry.sys.id}/published`, {
      method: 'PUT',
      headers: { ...headers, 'X-Contentful-Version': String(updated.sys.version) },
    });
    if (!pubRes.ok) {
      console.error('  Failed to publish entry:', await json(pubRes));
    } else {
      console.log('  Done.');
    }
  }
}

async function createStreamEntries() {
  const entries = await getAllPhotostreamEntries();
  const existingSlugs = new Set(entries.map((e) => e.fields.slug?.[LOCALE]).filter(Boolean));

  for (const stream of NEW_STREAMS) {
    if (existingSlugs.has(stream.slug)) {
      console.log(`Stream "${stream.slug}" already exists, skipping.`);
      continue;
    }

    console.log(`Creating photostream entry for "${stream.slug}"...`);
    const createRes = await fetch(`${BASE}/entries`, {
      method: 'POST',
      headers: { ...headers, 'X-Contentful-Content-Type': 'photostream' },
      body: JSON.stringify({
        fields: {
          title: { [LOCALE]: stream.title },
          slug: { [LOCALE]: stream.slug },
          photos: { [LOCALE]: [] },
        },
      }),
    });
    const created = await json(createRes);
    if (!createRes.ok) {
      console.error('  Failed to create entry:', created);
      continue;
    }

    const pubRes = await fetch(`${BASE}/entries/${created.sys.id}/published`, {
      method: 'PUT',
      headers: { ...headers, 'X-Contentful-Version': String(created.sys.version) },
    });
    if (!pubRes.ok) {
      console.error('  Failed to publish entry:', await json(pubRes));
    } else {
      console.log(`  Created and published (id=${created.sys.id}).`);
    }
  }
}

async function main() {
  await updateContentType();
  await ensureHomeSlug();
  await createStreamEntries();
  console.log('\nDone! Add photos to the People / Places / Things / Climate / Archived entries in Contentful,');
  console.log('and fill in each one\'s Description field to show under its title on the site.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
