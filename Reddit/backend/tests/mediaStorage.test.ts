import test, { describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { generatePresignedUploadUrl } from '../src/modules/media/media.service.js';

describe('Phase 8: MinIO S3 Object Storage & Pre-signed URL Tests', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'test_secret_for_unit_testing_key_12345';
  });

  test('generatePresignedUploadUrl generates presigned upload URL and public URL', async () => {
    const result = await generatePresignedUploadUrl(
      '507f1f77bcf86cd799439011',
      'sample_photo.jpg',
      'image/jpeg',
      1024 * 1024 // 1MB
    );

    assert.strictEqual(typeof result.uploadUrl, 'string');
    assert.ok(result.uploadUrl.includes('reddit-media'));
    assert.strictEqual(typeof result.publicUrl, 'string');
    assert.ok(result.publicUrl.endsWith('.jpg'));
    assert.strictEqual(result.expiresIn, 900);
  });

  test('generatePresignedUploadUrl sanitizes filenames with special characters', async () => {
    const result = await generatePresignedUploadUrl(
      '507f1f77bcf86cd799439011',
      '../../../etc/passwd_image.png',
      'image/png',
      2048
    );

    assert.ok(!result.key.includes('../'));
    assert.ok(result.key.includes('_etc_passwd_image.png'));
  });

  test('generatePresignedUploadUrl rejects images exceeding 10MB', async () => {
    await assert.rejects(
      async () => {
        await generatePresignedUploadUrl(
          '507f1f77bcf86cd799439011',
          'huge_photo.jpg',
          'image/jpeg',
          15 * 1024 * 1024 // 15MB
        );
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 400);
        assert.strictEqual(err.message, 'Image file size cannot exceed 10MB');
        return true;
      }
    );
  });
});
