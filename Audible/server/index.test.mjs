import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createAudibleServer } from './index.mjs';

let server;
let baseUrl;

before(async () => {
  server = createAudibleServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('reports health and serves the complete catalog', async () => {
  const health = await fetch(`${baseUrl}/api/health`).then((response) => response.json());
  const titles = await fetch(`${baseUrl}/api/titles`).then((response) => response.json());
  assert.equal(health.status, 'ok');
  assert.equal(health.catalogSize, titles.length);
  assert.equal(titles.length, 12);
});

test('filters title discovery by narrator and category', async () => {
  const response = await fetch(`${baseUrl}/api/titles?q=Asha%20King&category=Science%20Fiction`);
  const titles = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(titles.map((title) => title.id), ['sea-between-stars']);
});

test('serves direct title details and a clear not-found response', async () => {
  const response = await fetch(`${baseUrl}/api/titles/far-side-midnight`);
  const title = await response.json();
  assert.equal(response.status, 200);
  assert.equal(title.narrator, 'Imani Wells');

  const missing = await fetch(`${baseUrl}/api/titles/not-a-title`);
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), { error: 'Title not found' });
});

test('summarizes categories and ranks contextual recommendations', async () => {
  const categories = await fetch(`${baseUrl}/api/categories`).then((response) => response.json());
  const scienceFiction = categories.find((category) => category.name === 'Science Fiction');
  assert.deepEqual(scienceFiction, { name: 'Science Fiction', count: 2, included: 1 });

  const recommendations = await fetch(`${baseUrl}/api/recommendations/sea-between-stars`).then((response) => response.json());
  assert.equal(recommendations.length, 6);
  assert.equal(recommendations[0].id, 'letters-from-orbit');
  assert.ok(recommendations.every((title) => title.id !== 'sea-between-stars'));
});

test('provides a complete chapter manifest for the player', async () => {
  const player = await fetch(`${baseUrl}/api/player/far-side-midnight`).then((response) => response.json());
  assert.equal(player.titleId, 'far-side-midnight');
  assert.equal(player.chapters.length, 18);
  assert.equal(player.chapters[0].title, 'Opening');
  assert.equal(player.chapters.at(-1).start + player.chapters.at(-1).duration, player.duration);
});

test('streams the demo WAV with browser-seekable byte ranges', async () => {
  const response = await fetch(`${baseUrl}/audio/audible-demo-narration.wav`, { headers: { range: 'bytes=0-15' } });
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('content-type'), 'audio/wav');
  assert.match(response.headers.get('content-range'), /^bytes 0-15\/\d+$/);
  assert.equal(bytes.length, 16);
  assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF');
});

test('updates the library and validates listening progress', async () => {
  const added = await fetch(`${baseUrl}/api/library/sea-between-stars`, { method: 'PUT' }).then((response) => response.json());
  assert.ok(added.ids.includes('sea-between-stars'));

  const invalid = await fetch(`${baseUrl}/api/progress`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ titleId: 'far-side-midnight', position: -2 }),
  });
  assert.equal(invalid.status, 400);

  const valid = await fetch(`${baseUrl}/api/progress`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ titleId: 'far-side-midnight', position: 1800 }),
  }).then((response) => response.json());
  assert.deepEqual(valid, { titleId: 'far-side-midnight', position: 1800 });

  const resumed = await fetch(`${baseUrl}/api/progress/far-side-midnight`).then((response) => response.json());
  assert.equal(resumed.position, 1800);
  assert.equal(resumed.remaining, 36420);
  assert.equal(resumed.percentage, 4.71);
});
