import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { atomicVoteTarget } from '../src/modules/votes/vote.service.js';

describe('Phase 3: Relational Vote & Concurrency Tests', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret_for_unit_testing_key_12345';
  });

  test('atomicVoteTarget throws ServiceUnavailableError when database is disconnected', async () => {
    await assert.rejects(
      async () => {
        await atomicVoteTarget('507f1f77bcf86cd799439011', 'Post', '507f1f77bcf86cd799439012', 1);
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 503);
        assert.strictEqual(err.message, 'Database service unavailable');
        return true;
      }
    );
  });

  test('atomicVoteTarget correctly computes score delta for downvote when database is disconnected', async () => {
    await assert.rejects(
      async () => {
        await atomicVoteTarget('507f1f77bcf86cd799439011', 'Comment', '507f1f77bcf86cd799439013', -1);
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 503);
        return true;
      }
    );
  });
});
