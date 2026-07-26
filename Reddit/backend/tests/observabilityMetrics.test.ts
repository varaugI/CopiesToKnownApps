import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
  register,
  httpRequestCounter,
  httpRequestDurationHistogram,
  activeWebsocketGauge
} from '../src/common/observability/metrics.js';

describe('Phase 9: Full-Stack Observability & Prometheus Metrics Tests', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret_for_unit_testing_key_12345';
  });

  test('register.metrics() returns Prometheus metric definitions', async () => {
    const metricsOutput = await register.metrics();
    assert.strictEqual(typeof metricsOutput, 'string');
    assert.ok(metricsOutput.includes('http_requests_total'));
    assert.ok(metricsOutput.includes('http_request_duration_seconds'));
    assert.ok(metricsOutput.includes('active_websocket_connections'));
  });

  test('httpRequestCounter increments counter with labels', async () => {
    httpRequestCounter.inc({ method: 'GET', route: '/api/v1/posts', status_code: '200' });
    const metricsOutput = await register.metrics();
    assert.ok(metricsOutput.includes('method="GET"'));
    assert.ok(metricsOutput.includes('status_code="200"'));
  });

  test('activeWebsocketGauge increments and decrements gauge correctly', async () => {
    activeWebsocketGauge.inc();
    let metricsOutput = await register.metrics();
    assert.ok(metricsOutput.includes('active_websocket_connections 1'));

    activeWebsocketGauge.dec();
    metricsOutput = await register.metrics();
    assert.ok(metricsOutput.includes('active_websocket_connections 0'));
  });
});
