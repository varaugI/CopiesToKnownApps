import test, { describe, beforeEach, after } from 'node:test';
import assert from 'node:assert';
import { safeEnqueueJob, defaultJobOptions, karmaQueue, notificationQueue, mediaQueue, cleanupQueue } from '../src/common/queues/queue.config.js';

describe('Phase 6: Asynchronous BullMQ Queue & Worker Tests', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret_for_unit_testing_key_12345';
  });

  after(async () => {
    const queues = [karmaQueue, notificationQueue, mediaQueue, cleanupQueue];
    for (const q of queues) {
      if (q) {
        try {
          await q.close();
        } catch (e) {}
      }
    }
    setTimeout(() => process.exit(0), 100);
  });

  test('defaultJobOptions configures 3 attempts with exponential backoff', () => {
    assert.strictEqual(defaultJobOptions.attempts, 3);
    assert.deepStrictEqual(defaultJobOptions.backoff, {
      type: 'exponential',
      delay: 1000
    });
  });

  test('safeEnqueueJob executes safely without throwing unhandled exceptions', async () => {
    await safeEnqueueJob(karmaQueue, 'unit-test-karma-job', { userId: '507f1f77bcf86cd799439011', karmaDelta: 1 });
    assert.ok(true);
  });
});
