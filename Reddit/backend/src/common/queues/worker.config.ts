import { Worker, Job } from 'bullmq';
import { redisQueueConnection } from './queue.config.js';
import { User } from '../../modules/users/user.model.js';
import { RefreshToken } from '../../modules/auth/refresh-token.model.js';
import { isDbConnected } from '../../config/database.js';
import { queueJobsCounter } from '../observability/metrics.js';
import { logger } from '../logging/logger.js';

let karmaWorker: Worker | null = null;
let notificationWorker: Worker | null = null;
let mediaWorker: Worker | null = null;
let cleanupWorker: Worker | null = null;

export const startWorkers = () => {
  try {
    karmaWorker = new Worker(
      'karmaQueue',
      async (job: Job) => {
        const { userId, karmaDelta, karmaType } = job.data;
        if (!isDbConnected() || !userId) return;

        const updateField = karmaType === 'comment' ? { commentKarma: karmaDelta } : { postKarma: karmaDelta };
        await User.findByIdAndUpdate(userId, { $inc: updateField });
        logger.info({ userId, karmaDelta, karmaType }, 'Async karma worker updated user karma');
      },
      { connection: redisQueueConnection, concurrency: 5 }
    );

    notificationWorker = new Worker(
      'notificationQueue',
      async (job: Job) => {
        const { recipientId, senderId, type, message } = job.data;
        logger.info({ recipientId, senderId, type, message }, 'Async notification worker dispatched author alert');
      },
      { connection: redisQueueConnection, concurrency: 10 }
    );

    mediaWorker = new Worker(
      'mediaQueue',
      async (job: Job) => {
        const { postId, mediaUrl } = job.data;
        logger.info({ postId, mediaUrl }, 'Async media worker processed post asset');
      },
      { connection: redisQueueConnection, concurrency: 2 }
    );

    cleanupWorker = new Worker(
      'cleanupQueue',
      async (_job: Job) => {
        if (!isDbConnected()) return;
        const res = await RefreshToken.deleteMany({ expiresAt: { $lt: new Date() } });
        logger.info({ deletedCount: res.deletedCount }, 'Async cleanup worker purged expired sessions');
      },
      { connection: redisQueueConnection }
    );

    // Job Completion & Failure Metric Observers
    [karmaWorker, notificationWorker, mediaWorker, cleanupWorker].forEach((worker) => {
      worker.on('completed', (job) => {
        queueJobsCounter.inc({ queue: worker.name, status: 'success' });
      });

      worker.on('failed', (job, err) => {
        queueJobsCounter.inc({ queue: worker.name, status: 'failed' });
        logger.error(
          { jobId: job?.id, queueName: worker.name, attempts: job?.attemptsMade, err: err.message },
          'DLQ ALERT: Asynchronous job failed permanently after retries.'
        );
      });
    });

    logger.info('BullMQ asynchronous workers initialized successfully');
  } catch (err: any) {
    logger.warn({ err: err.message }, 'Failed to start BullMQ workers. Application running without background workers.');
  }
};

export const stopWorkers = async () => {
  const workers = [karmaWorker, notificationWorker, mediaWorker, cleanupWorker];
  for (const worker of workers) {
    if (worker) {
      try {
        await worker.close();
      } catch (e) {}
    }
  }
};
