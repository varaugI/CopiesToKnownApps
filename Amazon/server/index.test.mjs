import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createStorefrontServer } from './index.mjs';

let server;
let baseUrl;

before(async () => {
  server = createStorefrontServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('reports health and the full catalog', async () => {
  const health = await fetch(`${baseUrl}/api/health`).then((response) => response.json());
  const products = await fetch(`${baseUrl}/api/products`).then((response) => response.json());
  assert.equal(health.status, 'ok');
  assert.equal(health.catalogSize, products.length);
  assert.ok(products.length >= 10);
});

test('filters products through the BFF', async () => {
  const response = await fetch(`${baseUrl}/api/products?q=wireless&category=Computers`);
  const products = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(products.map((product) => product.id), ['mechanical-keyboard', 'ergonomic-mouse']);
});

test('validates additions and maintains a demo cart', async () => {
  const invalid = await fetch(`${baseUrl}/api/cart`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ productId: 'missing' }),
  });
  assert.equal(invalid.status, 400);

  const added = await fetch(`${baseUrl}/api/cart`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ productId: 'aero-buds', quantity: 2 }),
  }).then((response) => response.json());
  assert.equal(added[0].product.id, 'aero-buds');
  assert.equal(added[0].quantity, 2);
});

