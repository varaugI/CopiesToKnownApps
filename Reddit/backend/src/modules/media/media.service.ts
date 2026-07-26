import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '../../config/s3.js';
import { env } from '../../config/env.config.js';
import { ValidationError } from '../../common/errors/app-error.js';

const IMAGE_MAX_BYTES = 10 * 1024 * 1024; // 10MB
const VIDEO_MAX_BYTES = 50 * 1024 * 1024; // 50MB

export const generatePresignedUploadUrl = async (
  _userId: string,
  filename: string,
  fileType: string,
  fileSize: number
) => {
  if (fileType.startsWith('image/') && fileSize > IMAGE_MAX_BYTES) {
    throw new ValidationError('Image file size cannot exceed 10MB');
  }

  if (fileType.startsWith('video/') && fileSize > VIDEO_MAX_BYTES) {
    throw new ValidationError('Video file size cannot exceed 50MB');
  }

  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const key = `uploads/${uuidv4()}-${sanitizedFilename}`;

  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  const publicUrl = `${env.S3_PUBLIC_URL}/${key}`;

  return {
    uploadUrl,
    publicUrl,
    key,
    expiresIn: 900
  };
};
