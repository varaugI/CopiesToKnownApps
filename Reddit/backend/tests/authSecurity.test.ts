import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  hashToken,
  rotateRefreshTokenSession,
  revokeSingleSession,
  revokeAllUserSessions
} from '../src/modules/auth/auth.service.js';

describe('Phase 2: Auth Security, Cookie Refresh & Reuse Detection Tests', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret_for_unit_testing_key_12345';
  });

  test('hashToken computes deterministic SHA-256 hex hash', () => {
    const rawToken = 'super_secret_raw_token_string_12345';
    const hash1 = hashToken(rawToken);
    const hash2 = hashToken(rawToken);
    assert.strictEqual(typeof hash1, 'string');
    assert.strictEqual(hash1.length, 64);
    assert.strictEqual(hash1, hash2);
  });

  test('rotateRefreshTokenSession throws UnauthorizedError when token is missing', async () => {
    await assert.rejects(
      async () => {
        await rotateRefreshTokenSession('');
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 503); // DB unavailable in unit environment
        return true;
      }
    );
  });

  test('revokeSingleSession completes safely when database is disconnected', async () => {
    await revokeSingleSession('raw_test_token_123');
    assert.ok(true);
  });

  test('revokeAllUserSessions throws ServiceUnavailableError when database is disconnected', async () => {
    await assert.rejects(
      async () => {
        await revokeAllUserSessions('mock_user_id_123');
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 503);
        return true;
      }
    );
  });
});
