import { Queue, JobsOptions } from 'bullmq';
import { env } from '../../config/env.config.js';
import { logger } from '../logging/logger.js';

const parseRedisUri = (uri: string) => {
  try {
    const url = new URL(uri);
    return {
      host: url.hostname || 'localhost',
      port: url.port ? parseInt(url.port, 10) : 6379,
      password: url.password || undefined
    };
  } catch (e) {
    return { host: 'localhost', port: 6379 };
  }
};

export const redisQueueConnection = {
  ...parseRedisUri(env.REDIS_URI),
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  retryStrategy: () => null
};

export const defaultJobOptions: JobsOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000
  },
  removeOnComplete: 100,
  removeOnFail: 1000
};

export let karmaQueue: Queue | null = null;
export let notificationQueue: Queue | null = null;
export let mediaQueue: Queue | null = null;
export let cleanupQueue: Queue | null = null;

try {
  karmaQueue = new Queue('karmaQueue', { connection: redisQueueConnection, defaultJobOptions });
  notificationQueue = new Queue('notificationQueue', { connection: redisQueueConnection, defaultJobOptions });
  mediaQueue = new Queue('mediaQueue', { connection: redisQueueConnection, defaultJobOptions });
  cleanupQueue = new Queue('cleanupQueue', { connection: redisQueueConnection, defaultJobOptions });
} catch (err: any) {
  logger.warn({ err: err.message }, 'Failed to initialize BullMQ queues. Queue operations will fail open.');
}

export const safeEnqueueJob = async (queue: Queue | null, name: string, data: any) => {
  if (!queue) return;
  try {
    await queue.add(name, data);
  } catch (err: any) {
    logger.warn({ queueName: queue.name, jobName: name, err: err.message }, 'Failed to enqueue job. Executing side effect fallback.');
  }
};
