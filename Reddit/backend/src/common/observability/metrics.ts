import client from 'prom-client';

export const register = new client.Registry();

// Default process metrics (CPU, Heap size, Event loop lag, Memory usage)
client.collectDefaultMetrics({
  register,
  prefix: 'nodejs_'
});

// Custom Application Metrics
export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests processed',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

export const httpRequestDurationHistogram = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register]
});

export const redisCacheHitsCounter = new client.Counter({
  name: 'redis_cache_hits_total',
  help: 'Total Redis cache hits',
  labelNames: ['prefix'],
  registers: [register]
});

export const redisCacheMissesCounter = new client.Counter({
  name: 'redis_cache_misses_total',
  help: 'Total Redis cache misses',
  labelNames: ['prefix'],
  registers: [register]
});

export const activeWebsocketGauge = new client.Gauge({
  name: 'active_websocket_connections',
  help: 'Current active Socket.IO connections',
  registers: [register]
});

export const queueJobsCounter = new client.Counter({
  name: 'queue_jobs_processed_total',
  help: 'Total BullMQ jobs processed',
  labelNames: ['queue', 'status'],
  registers: [register]
});
