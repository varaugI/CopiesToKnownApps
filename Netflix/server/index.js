import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import cluster from 'cluster';
import os from 'os';
import { MOVIES, PROFILES, CATEGORIES } from './data/moviesData.js';
import { cache } from './config/cache.js';
import { apiLimiter, searchLimiter } from './middleware/rateLimiter.js';
import { handleRangeStream } from './services/videoStream.js';
import { watchPartyManager } from './services/watchParty.js';

const PORT = process.env.PORT || 5000;
const numCPUs = os.cpus().length;

// In Multi-Core environments, launch worker processes
if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  console.log(`⚡ Primary cluster process ${process.pid} is running`);
  console.log(`🚀 Spawning ${numCPUs} cluster worker processes...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`⚠️ Worker process ${worker.process.pid} died. Spawning replacement...`);
    cluster.fork();
  });
} else {
  const app = express();

  // Enterprise Security & Compression Middleware
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(cors());
  app.use(express.json());

  // Apply Rate Limiter
  app.use('/api/', apiLimiter);

  // In-memory MyList state per profile
  const userLists = {
    p1: ['m1', 'm3'],
    p2: ['m2'],
    p3: [],
    p4: ['m1', 'm2', 'm5']
  };

  // 1. Health & Cluster Metrics API
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'StreamFlix Node API Prototype',
      workerPid: process.pid,
      cpus: numCPUs,
      cacheStats: cache.getStats(),
      timestamp: new Date().toISOString()
    });
  });

  // 2. Metrics Monitor Endpoint
  app.get('/api/metrics', (req, res) => {
    res.json({
      service: 'StreamFlix Node API Prototype',
      workerId: process.pid,
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      cache: cache.getStats(),
      limitations: {
        cache: 'In-process Map cache (not distributed across workers)',
        watchParty: 'In-process Map rooms (worker memory local)',
        myList: 'Worker memory store (inconsistent across cluster workers)',
        rateLimiter: 'MemoryStore (per process instance)'
      }
    });
  });

  // 3. Profiles API (Cached 5 minutes)
  app.get('/api/profiles', (req, res) => {
    const cacheKey = 'profiles_all';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    cache.set(cacheKey, PROFILES, 300);
    res.json(PROFILES);
  });

  // 4. Categories API (Cached 10 minutes)
  app.get('/api/categories', (req, res) => {
    const cacheKey = 'categories_all';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    cache.set(cacheKey, CATEGORIES, 600);
    res.json(CATEGORIES);
  });

  // 5. Billboard Featured Title (Cached 2 minutes)
  app.get('/api/billboard', (req, res) => {
    const cacheKey = 'billboard_featured';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const featured = MOVIES[0];
    cache.set(cacheKey, featured, 120);
    res.json(featured);
  });

  // 6. High-Speed Search Endpoint (Rate-limited & Cached)
  app.get('/api/search', searchLimiter, (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);

    const query = q.toLowerCase();
    const cacheKey = `search_${query}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const results = MOVIES.filter(m =>
      m.title.toLowerCase().includes(query) ||
      m.genres.some(g => g.toLowerCase().includes(query)) ||
      m.cast.some(c => c.toLowerCase().includes(query)) ||
      m.director.toLowerCase().includes(query)
    );

    cache.set(cacheKey, results, 60); // 1 minute search TTL cache
    res.json(results);
  });

  // 7. Movies Catalog Endpoint (Cached by Filter Combo)
  app.get('/api/movies', (req, res) => {
    const { category, genre, type } = req.query;
    const cacheKey = `movies_${category || 'all'}_${genre || 'all'}_${type || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    let list = [...MOVIES];
    if (type) {
      list = list.filter(m => m.type.toLowerCase() === type.toLowerCase());
    }
    if (category) {
      list = list.filter(m => m.categories.includes(category));
    }
    if (genre && genre !== 'All') {
      list = list.filter(m => m.genres.includes(genre));
    }

    cache.set(cacheKey, list, 180);
    res.json(list);
  });

  // 8. Single Movie Detail API
  app.get('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const cacheKey = `movie_detail_${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const movie = MOVIES.find(m => m.id === id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const recommendations = MOVIES.filter(m => m.id !== movie.id).slice(0, 4);
    const result = { ...movie, recommendations };

    cache.set(cacheKey, result, 300);
    res.json(result);
  });

  // 9. Low-Latency Adaptive HTTP Chunked Range Video Streaming API
  app.get('/api/stream/:id', (req, res) => {
    const movie = MOVIES.find(m => m.id === req.params.id);
    if (!movie) return res.status(404).json({ error: 'Stream title not found' });
    handleRangeStream(req, res, movie.videoUrl);
  });

  // Watch Party Real-Time Sync APIs
  app.post('/api/watchparty/create', (req, res) => {
    const { hostName, movieId } = req.body;
    const room = watchPartyManager.createRoom(hostName || 'Anonymous', movieId);
    res.json(room);
  });

  app.post('/api/watchparty/join', (req, res) => {
    const { roomId, userName } = req.body;
    const room = watchPartyManager.joinRoom(roomId, userName || 'Guest');
    if (!room) return res.status(404).json({ error: 'Watch party room not found' });
    res.json(room);
  });

  app.get('/api/watchparty/:roomId', (req, res) => {
    const room = watchPartyManager.getRoom(req.params.roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json(room);
  });

  app.post('/api/watchparty/:roomId/sync', (req, res) => {
    const { isPlaying, currentTime } = req.body;
    const room = watchPartyManager.syncPlayback(req.params.roomId, isPlaying, currentTime);
    res.json(room);
  });

  app.post('/api/watchparty/:roomId/message', (req, res) => {
    const { sender, text } = req.body;
    const msg = watchPartyManager.addMessage(req.params.roomId, sender, text);
    res.json(msg);
  });

  // 10. My List API
  app.get('/api/mylist/:profileId', (req, res) => {
    const { profileId } = req.params;
    const listIds = userLists[profileId] || [];
    const listMovies = MOVIES.filter(m => listIds.includes(m.id));
    res.json(listMovies);
  });

  app.post('/api/mylist/:profileId/toggle', (req, res) => {
    const { profileId } = req.params;
    const { movieId } = req.body;

    if (!userLists[profileId]) {
      userLists[profileId] = [];
    }

    const idx = userLists[profileId].indexOf(movieId);
    if (idx > -1) {
      userLists[profileId].splice(idx, 1);
    } else {
      userLists[profileId].push(movieId);
    }

    const listMovies = MOVIES.filter(m => userLists[profileId].includes(m.id));
    res.json({ profileId, myList: userLists[profileId], movies: listMovies });
  });

  const server = app.listen(PORT, () => {
    console.log(`🚀 [Worker ${process.pid}] StreamFlix Enterprise Node Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const FALLBACK_PORT = Number(PORT) + 1;
      console.log(`⚠️ Port ${PORT} busy, switching to fallback port ${FALLBACK_PORT}...`);
      app.listen(FALLBACK_PORT, () => {
        console.log(`🚀 [Worker ${process.pid}] StreamFlix Enterprise Node Server running on http://localhost:${FALLBACK_PORT}`);
      });
    }
  });
}
