import http from 'node:http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env.config.js';
import { connectDB, disconnectDB } from './config/database.js';
import { connectRedis, disconnectRedis } from './config/redis.js';
import { startWorkers, stopWorkers } from './common/queues/worker.config.js';
import { initSocketServer } from './common/realtime/socket.server.js';
import { logger } from './common/logging/logger.js';
import { requestIdMiddleware } from './common/middleware/request-id.middleware.js';
import { errorMiddleware, notFoundMiddleware } from './common/middleware/error.middleware.js';

import healthRoutes from './modules/health/health.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import subredditRoutes from './modules/subreddits/subreddit.routes.js';
import postRoutes from './modules/posts/post.routes.js';
import commentRoutes from './modules/comments/comment.routes.js';
import mediaRoutes from './modules/media/media.routes.js';

// Connect Database & Redis asynchronously
connectDB();
connectRedis();
startWorkers();

const app = express();
const pinoHttpHandler = (pinoHttp as any).default || pinoHttp;

import { metricsMiddleware } from './common/observability/metrics.middleware.js';
import { register } from './common/observability/metrics.js';

// Security Headers & Request Correlation
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(requestIdMiddleware);
app.use(metricsMiddleware);
app.use(pinoHttpHandler({ logger, reqCustomProps: (req: express.Request) => ({ requestId: req.requestId }) }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Prometheus Metrics Endpoint
app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

// Health Probes (Direct & Versioned)
app.use('/health', healthRoutes);
app.use('/api/v1/health', healthRoutes);

// Versioned API Router (/api/v1)
const v1Router = express.Router();
v1Router.use('/auth', authRoutes);
v1Router.use('/subreddits', subredditRoutes);
v1Router.use('/posts', postRoutes);
v1Router.use('/comments', commentRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/media', mediaRoutes);

// Compatibility Fallback Route (/api)
app.use('/api/v1', v1Router);
app.use('/api', v1Router);

// Root Status Endpoint
app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    app: 'Reddit Modular Monolith API (TypeScript)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Centralized Error Handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const httpServer = http.createServer(app);
initSocketServer(httpServer);

const server = httpServer.listen(env.PORT, () => {
  logger.info({ port: env.PORT, environment: env.NODE_ENV }, `🚀 Reddit Modular Monolith API Server running on port ${env.PORT}`);
});

// Graceful Shutdown Lifecycle
const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, `Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    logger.info('HTTP server closed. Closing workers and database connections...');
    await stopWorkers();
    await disconnectRedis();
    await disconnectDB();
    logger.info('Graceful shutdown completed successfully.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
