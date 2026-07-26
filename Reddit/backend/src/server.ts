import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env.config.js';
import { connectDB, disconnectDB } from './config/database.js';
import { logger } from './common/logging/logger.js';
import { requestIdMiddleware } from './common/middleware/request-id.middleware.js';
import { errorMiddleware, notFoundMiddleware } from './common/middleware/error.middleware.js';

import healthRoutes from './modules/health/health.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import subredditRoutes from './modules/subreddits/subreddit.routes.js';
import postRoutes from './modules/posts/post.routes.js';
import commentRoutes from './modules/comments/comment.routes.js';

// Connect Database asynchronously
connectDB();

const app = express();
const pinoHttpHandler = (pinoHttp as any).default || pinoHttp;

// Security Headers & Request Correlation
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(requestIdMiddleware);
app.use(pinoHttpHandler({ logger, reqCustomProps: (req: express.Request) => ({ requestId: req.requestId }) }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

app.use('/api/v1', v1Router);
// Backward Compatibility for Frontend
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

const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, environment: env.NODE_ENV }, `🚀 Reddit Modular Monolith API Server running on port ${env.PORT}`);
});

// Graceful Shutdown Lifecycle
const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, `Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    logger.info('HTTP server closed. Closing database connections...');
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
