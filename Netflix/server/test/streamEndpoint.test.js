import test from 'node:test';
import assert from 'node:assert';
import { handleRangeStream } from '../services/videoStream.js';

test('handleRangeStream refuses misleading empty 206 responses without media bytes', () => {
  const req = { headers: {} };
  let statusCode = null;
  let jsonBody = null;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      jsonBody = body;
      return this;
    }
  };

  handleRangeStream(req, res, 'http://example.com/sample.mp4');

  assert.strictEqual(statusCode, 501);
  assert.strictEqual(jsonBody.status, 'MEDIA_PIPELINE_NOT_INITIALIZED');
  assert.match(jsonBody.message, /HLS media pipeline/);
});
