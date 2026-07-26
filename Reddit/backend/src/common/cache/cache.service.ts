import { getRedisClient, isRedisConnected } from '../../config/redis.js';
import { redisCacheHitsCounter, redisCacheMissesCounter } from '../observability/metrics.js';
import { logger } from '../logging/logger.js';

export const getCache = async <T>(key: string): Promise<T | null> => {
  const prefix = key.split(':')[0] || 'default';
  if (!isRedisConnected()) {
    redisCacheMissesCounter.inc({ prefix });
    return null;
  }
  const client = getRedisClient();
  if (!client) {
    redisCacheMissesCounter.inc({ prefix });
    return null;
  }

  try {
    const data = await client.get(key);
    if (!data) {
      redisCacheMissesCounter.inc({ prefix });
      return null;
    }
    redisCacheHitsCounter.inc({ prefix });
    return JSON.parse(data) as T;
  } catch (err: any) {
    redisCacheMissesCounter.inc({ prefix });
    logger.warn({ key, err: err.message }, 'Cache read failed. Falling back to DB.');
    return null;
  }
};

export const setCache = async (key: string, value: any, ttlSeconds: number = 300): Promise<void> => {
  if (!isRedisConnected()) return;
  const client = getRedisClient();
  if (!client) return;

  try {
    const serialized = JSON.stringify(value);
    await client.setex(key, ttlSeconds, serialized);
  } catch (err: any) {
    logger.warn({ key, err: err.message }, 'Cache write failed. Proceeding without cache.');
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  if (!isRedisConnected()) return;
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.del(key);
  } catch (err: any) {
    logger.warn({ key, err: err.message }, 'Cache deletion failed.');
  }
};

export const deleteCachePattern = async (pattern: string): Promise<void> => {
  if (!isRedisConnected()) return;
  const client = getRedisClient();
  if (!client) return;

  try {
    let stream = client.scanStream({ match: pattern, count: 100 });
    stream.on('data', (keys: string[]) => {
      if (keys.length > 0) {
        const pipeline = client.pipeline();
        keys.forEach((key) => pipeline.del(key));
        pipeline.exec().catch(() => {});
      }
    });
  } catch (err: any) {
    logger.warn({ pattern, err: err.message }, 'Cache pattern deletion failed.');
  }
};
