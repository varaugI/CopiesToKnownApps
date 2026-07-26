import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { getCache, setCache, deleteCachePattern } from '../src/common/cache/cache.service.js';
import { createRateLimiter } from '../src/common/middleware/rate-limiter.middleware.js';

describe('Phase 5: Redis Shared Caching & Distributed Rate Limiting Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret_for_unit_testing_key_12345';
    req = {
      ip: '127.0.0.1',
      headers: {},
      user: null
    };
    res = {
      headers: {} as Record<string, string>,
      statusCode: 200,
      setHeader(name: string, value: string) {
        this.headers[name] = value;
      }
    };
  });

  test('getCache returns null when Redis is offline or key missing', async () => {
    const data = await getCache('non_existent_key_123');
    assert.strictEqual(data, null);
  });

  test('setCache executes without throwing when Redis is offline (fail-open)', async () => {
    await setCache('test_key', { foo: 'bar' }, 60);
    assert.ok(true);
  });

  test('deleteCachePattern executes without throwing when Redis is offline', async () => {
    await deleteCachePattern('posts:feed:*');
    assert.ok(true);
  });

  test('createRateLimiter middleware fails open when Redis is offline', async () => {
    const limiter = createRateLimiter({ prefix: 'unit_test', limit: 5, windowSeconds: 60 });
    let nextCalled = false;
    let errReceived: any = null;

    await limiter(req, res, (err?: any) => {
      nextCalled = true;
      errReceived = err;
    });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(errReceived, undefined);
  });
});
