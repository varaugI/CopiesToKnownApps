import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { initSocketServer } from '../src/common/realtime/socket.server.js';

describe('Phase 12: Distributed Scaling & Socket.IO Redis Adapter Tests', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret_for_unit_testing_key_12345';
  });

  test('initSocketServer initializes Socket.IO server cleanly without Redis', () => {
    const server = http.createServer();
    const io = initSocketServer(server);
    assert.ok(io);
    assert.strictEqual(typeof io.on, 'function');
    server.close();
  });
});
