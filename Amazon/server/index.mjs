import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const moduleDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(moduleDirectory, '..');
const distRoot = join(projectRoot, 'dist');
const catalog = JSON.parse(await readFile(join(projectRoot, 'data', 'catalog.json'), 'utf8'));

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 32_768) throw new Error('Request body is too large');
    chunks.push(chunk);
  }
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
}

function serializeCart(cart) {
  return [...cart.entries()].map(([productId, quantity]) => ({
    product: catalog.find((product) => product.id === productId),
    quantity,
  })).filter((line) => line.product);
}

async function serveStatic(pathname, response) {
  if (!existsSync(distRoot)) {
    sendJson(response, 503, { error: 'Client build is missing. Run npm run build first.' });
    return;
  }

  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const candidate = normalize(join(distRoot, requested));
  const filePath = candidate.startsWith(distRoot) && existsSync(candidate) ? candidate : join(distRoot, 'index.html');

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      'content-type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
      'cache-control': filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    response.end(body);
  } catch {
    sendJson(response, 404, { error: 'Not found' });
  }
}

export function createStorefrontServer() {
  const cart = new Map();

  return createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const { pathname, searchParams } = url;

    try {
      if (request.method === 'GET' && pathname === '/api/health') {
        sendJson(response, 200, { status: 'ok', service: 'amazon-storefront-bff', catalogSize: catalog.length });
        return;
      }

      if (request.method === 'GET' && pathname === '/api/products') {
        const query = (searchParams.get('q') ?? '').trim().toLocaleLowerCase();
        const category = searchParams.get('category') ?? 'All';
        const products = catalog.filter((product) => {
          const inCategory = category === 'All' || product.category === category;
          const searchable = `${product.title} ${product.brand} ${product.category}`.toLocaleLowerCase();
          return inCategory && (!query || searchable.includes(query));
        });
        sendJson(response, 200, products);
        return;
      }

      if (request.method === 'GET' && pathname === '/api/deals') {
        const deals = [...catalog]
          .sort((a, b) => (1 - b.price / b.listPrice) - (1 - a.price / a.listPrice))
          .slice(0, 7);
        sendJson(response, 200, deals);
        return;
      }

      if (request.method === 'GET' && pathname === '/api/cart') {
        sendJson(response, 200, serializeCart(cart));
        return;
      }

      if (request.method === 'POST' && pathname === '/api/cart') {
        const payload = await readJson(request);
        const product = catalog.find((item) => item.id === payload.productId);
        const quantity = Number(payload.quantity ?? 1);
        if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
          sendJson(response, 400, { error: 'A valid productId and quantity from 1 to 20 are required.' });
          return;
        }
        cart.set(product.id, (cart.get(product.id) ?? 0) + quantity);
        sendJson(response, 201, serializeCart(cart));
        return;
      }

      if (request.method === 'DELETE' && pathname.startsWith('/api/cart/')) {
        const productId = decodeURIComponent(pathname.slice('/api/cart/'.length));
        cart.delete(productId);
        sendJson(response, 200, serializeCart(cart));
        return;
      }

      if (request.method === 'POST' && pathname === '/api/checkout') {
        const itemCount = [...cart.values()].reduce((total, quantity) => total + quantity, 0);
        cart.clear();
        sendJson(response, 201, { orderId: `DEMO-${Date.now()}`, itemCount, status: 'demo-confirmed' });
        return;
      }

      if (pathname.startsWith('/api/')) {
        sendJson(response, 404, { error: 'API route not found' });
        return;
      }

      await serveStatic(pathname, response);
    } catch (error) {
      sendJson(response, 400, { error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });
}

export function startServer(port = Number(process.env.PORT ?? 4001)) {
  const server = createStorefrontServer();
  server.listen(port, '127.0.0.1', () => {
    console.log(`Amazon storefront available at http://127.0.0.1:${port}`);
  });
  return server;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) startServer();

