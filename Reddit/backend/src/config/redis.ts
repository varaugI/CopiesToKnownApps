import { Redis } from 'ioredis';
import { env } from './env.config.js';
import { logger } from '../common/logging/logger.js';

let redisClient: Redis | null = null;
let isConnected = false;

export const getRedisClient = (): Redis | null => {
  if (!redisClient) {
    try {
      redisClient = new Redis(env.REDIS_URI, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        retryStrategy(times) {
          if (times > 3) return null; // Stop retrying after 3 attempts
          return Math.min(times * 200, 1000);
        }
      });

      redisClient.on('connect', () => {
        isConnected = true;
        logger.info('Redis client connected successfully');
      });

      redisClient.on('ready', () => {
        isConnected = true;
      });

      redisClient.on('error', (err) => {
        isConnected = false;
        logger.warn({ err: err.message }, 'Redis connection error. Operating in degraded fail-open mode.');
      });

      redisClient.on('close', () => {
        isConnected = false;
      });
    } catch (err: any) {
      logger.warn({ err: err.message }, 'Failed to initialize Redis client. Degraded mode active.');
      redisClient = null;
      isConnected = false;
    }
  }
  return redisClient;
};

export const isRedisConnected = (): boolean => isConnected;

export const connectRedis = async () => {
  const client = getRedisClient();
  if (client) {
    try {
      await client.connect();
    } catch (err: any) {
      logger.warn({ err: err.message }, 'Redis server unavailable at startup. Degraded cache mode enabled.');
    }
  }
};

export const disconnectRedis = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch (e) {}
    redisClient = null;
    isConnected = false;
  }
};
