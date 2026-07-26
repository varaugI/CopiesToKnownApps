import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { registerNewUser, authenticateUser, getCurrentUserProfile } from '../src/modules/auth/auth.service.js';
import { protect } from '../src/modules/auth/auth.middleware.js';

describe('Phase 1: Modular Monolith Auth & Error Handling Tests', () => {
  let req: any, res: any;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret_for_unit_testing_key_12345';
    req = {
      body: {},
      headers: {},
      params: {},
      user: null
    };
    res = {
      statusCode: 200,
      jsonData: null,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      json(data: any) {
        this.jsonData = data;
        return this;
      }
    };
  });

  test('registerNewUser throws ServiceUnavailableError when database is unavailable', async () => {
    await assert.rejects(
      async () => {
        await registerNewUser('testuser', 'test@example.com', 'Password123!');
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 503);
        assert.strictEqual(err.message, 'Database service unavailable');
        return true;
      }
    );
  });

  test('authenticateUser throws ServiceUnavailableError when database is unavailable', async () => {
    await assert.rejects(
      async () => {
        await authenticateUser('testuser', 'Password123!');
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 503);
        assert.strictEqual(err.message, 'Database service unavailable');
        return true;
      }
    );
  });

  test('getCurrentUserProfile throws ServiceUnavailableError when database is unavailable', async () => {
    await assert.rejects(
      async () => {
        await getCurrentUserProfile('mock_user_id');
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 503);
        assert.strictEqual(err.message, 'Database service unavailable');
        return true;
      }
    );
  });

  test('protect middleware rejects request with 503 when database is unavailable', async () => {
    const jwt = (await import('jsonwebtoken')).default;
    const { env } = await import('../src/config/env.config.js');
    const validToken = jwt.sign({ id: '123456789012345678901234' }, env.JWT_SECRET);
    req.headers.authorization = `Bearer ${validToken}`;

    let nextCalled = false;
    let receivedErr: any = null;
    const next = (err?: any) => {
      nextCalled = true;
      receivedErr = err;
    };

    await protect(req, res, next);

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(receivedErr.statusCode, 503);
    assert.strictEqual(receivedErr.message, 'Database service unavailable');
  });
});
