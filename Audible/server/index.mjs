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
  '.wav': 'audio/wav',
  '.webp': 'image/webp',
};

function sendJson(response, status, payload) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
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

function findTitle(id) {
  return catalog.find((title) => title.id === id);
}

function buildChapters(title) {
  const baseDuration = Math.floor(title.duration / title.chapters);
  return Array.from({ length: title.chapters }, (_, index) => {
    const start = index * baseDuration;
    const duration = index === title.chapters - 1 ? title.duration - start : baseDuration;
    return {
      number: index + 1,
      title: index === 0 ? 'Opening' : `Chapter ${index + 1}`,
      start,
      duration,
    };
  });
}

function recommendationsFor(title) {
  return catalog
    .filter((candidate) => candidate.id !== title.id)
    .sort((left, right) => {
      const leftCategory = left.category === title.category ? 1 : 0;
      const rightCategory = right.category === title.category ? 1 : 0;
      if (leftCategory !== rightCategory) return rightCategory - leftCategory;
      if (left.included !== right.included) return Number(right.included) - Number(left.included);
      return right.rating - left.rating;
    })
    .slice(0, 6);
}

async function serveStatic(pathname, request, response) {
  if (!existsSync(distRoot)) {
    sendJson(response, 503, { error: 'Client build is missing. Run npm run build first.' });
    return;
  }
  const requested = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const candidate = normalize(join(distRoot, requested));
  const filePath = candidate.startsWith(distRoot) && existsSync(candidate) ? candidate : join(distRoot, 'index.html');
  try {
    const body = await readFile(filePath);
    const contentType = mimeTypes[extname(filePath)] ?? 'application/octet-stream';
    const range = request.headers.range;
    if (range && filePath.endsWith('.wav')) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      const start = match?.[1] ? Number(match[1]) : 0;
      const end = match?.[2] ? Math.min(Number(match[2]), body.length - 1) : body.length - 1;
      if (!match || !Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start > end || start >= body.length) {
        response.writeHead(416, { 'content-range': `bytes */${body.length}` });
        response.end();
        return;
      }
      response.writeHead(206, {
        'accept-ranges': 'bytes',
        'content-length': end - start + 1,
        'content-range': `bytes ${start}-${end}/${body.length}`,
        'content-type': contentType,
        'cache-control': 'public, max-age=86400',
      });
      response.end(body.subarray(start, end + 1));
      return;
    }
    response.writeHead(200, {
      'accept-ranges': filePath.endsWith('.wav') ? 'bytes' : 'none',
      'content-length': body.length,
      'content-type': contentType,
      'cache-control': filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    response.end(body);
  } catch {
    sendJson(response, 404, { error: 'Not found' });
  }
}

export function createAudibleServer() {
  const library = new Set(['far-side-midnight', 'atlas-small-joys', 'sleeping-forest']);
  const progress = new Map([['far-side-midnight', 1230]]);

  return createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const { pathname, searchParams } = url;
    try {
      if (request.method === 'GET' && pathname === '/api/health') {
        sendJson(response, 200, { status: 'ok', service: 'audible-listening-bff', catalogSize: catalog.length });
        return;
      }
      if (request.method === 'GET' && pathname === '/api/titles') {
        const query = (searchParams.get('q') ?? '').trim().toLocaleLowerCase();
        const category = searchParams.get('category') ?? 'All';
        const titles = catalog.filter((title) => {
          const inCategory = category === 'All' || title.category === category;
          const searchable = `${title.title} ${title.author} ${title.narrator} ${title.category} ${title.tags.join(' ')}`.toLocaleLowerCase();
          return inCategory && (!query || searchable.includes(query));
        });
        sendJson(response, 200, titles);
        return;
      }
      if (request.method === 'GET' && pathname.startsWith('/api/titles/')) {
        const id = decodeURIComponent(pathname.slice('/api/titles/'.length));
        const title = findTitle(id);
        if (!title) {
          sendJson(response, 404, { error: 'Title not found' });
          return;
        }
        sendJson(response, 200, title);
        return;
      }
      if (request.method === 'GET' && pathname === '/api/categories') {
        const categories = [...new Set(catalog.map((title) => title.category))]
          .sort()
          .map((name) => ({
            name,
            count: catalog.filter((title) => title.category === name).length,
            included: catalog.filter((title) => title.category === name && title.included).length,
          }));
        sendJson(response, 200, categories);
        return;
      }
      if (request.method === 'GET' && pathname.startsWith('/api/recommendations/')) {
        const id = decodeURIComponent(pathname.slice('/api/recommendations/'.length));
        const title = findTitle(id);
        if (!title) {
          sendJson(response, 404, { error: 'Title not found' });
          return;
        }
        sendJson(response, 200, recommendationsFor(title));
        return;
      }
      if (request.method === 'GET' && pathname === '/api/featured') {
        sendJson(response, 200, catalog.filter((title) => title.included).slice(0, 6));
        return;
      }
      if (request.method === 'GET' && pathname === '/api/library') {
        sendJson(response, 200, catalog.filter((title) => library.has(title.id)).map((title) => ({ ...title, progress: progress.get(title.id) ?? 0 })));
        return;
      }
      if ((request.method === 'PUT' || request.method === 'DELETE') && pathname.startsWith('/api/library/')) {
        const id = decodeURIComponent(pathname.slice('/api/library/'.length));
        if (!catalog.some((title) => title.id === id)) {
          sendJson(response, 404, { error: 'Title not found' });
          return;
        }
        if (request.method === 'PUT') library.add(id);
        else library.delete(id);
        sendJson(response, 200, { ids: [...library] });
        return;
      }
      if (request.method === 'POST' && pathname === '/api/progress') {
        const payload = await readJson(request);
        const title = catalog.find((item) => item.id === payload.titleId);
        const position = Number(payload.position);
        if (!title || !Number.isFinite(position) || position < 0 || position > title.duration) {
          sendJson(response, 400, { error: 'A valid titleId and listening position are required.' });
          return;
        }
        progress.set(title.id, Math.floor(position));
        sendJson(response, 200, { titleId: title.id, position: progress.get(title.id) });
        return;
      }
      if (request.method === 'GET' && pathname.startsWith('/api/progress/')) {
        const id = decodeURIComponent(pathname.slice('/api/progress/'.length));
        const title = findTitle(id);
        if (!title) {
          sendJson(response, 404, { error: 'Title not found' });
          return;
        }
        const position = progress.get(title.id) ?? 0;
        sendJson(response, 200, {
          titleId: title.id,
          position,
          duration: title.duration,
          remaining: title.duration - position,
          percentage: Number(((position / title.duration) * 100).toFixed(2)),
        });
        return;
      }
      if (request.method === 'GET' && pathname.startsWith('/api/player/')) {
        const id = decodeURIComponent(pathname.slice('/api/player/'.length));
        const title = findTitle(id);
        if (!title) {
          sendJson(response, 404, { error: 'Title not found' });
          return;
        }
        sendJson(response, 200, {
          titleId: title.id,
          title: title.title,
          author: title.author,
          narrator: title.narrator,
          duration: title.duration,
          position: progress.get(title.id) ?? 0,
          chapters: buildChapters(title),
        });
        return;
      }
      if (pathname.startsWith('/api/')) {
        sendJson(response, 404, { error: 'API route not found' });
        return;
      }
      await serveStatic(pathname, request, response);
    } catch (error) {
      sendJson(response, 400, { error: error instanceof Error ? error.message : 'Invalid request' });
    }
  });
}

export function startServer(port = Number(process.env.PORT ?? 4002)) {
  const server = createAudibleServer();
  server.listen(port, '127.0.0.1', () => console.log(`Audible listening study available at http://127.0.0.1:${port}`));
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) startServer();
