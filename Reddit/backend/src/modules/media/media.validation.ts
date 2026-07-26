import { z } from 'zod';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4'
] as const;

export const presignedUrlSchema = z.object({
  body: z.object({
    filename: z.string().min(1, 'Filename is required').max(200, 'Filename max 200 characters'),
    fileType: z.enum(ALLOWED_MIME_TYPES, {
      errorMap: () => ({ message: 'Unsupported file format. Allowed formats: JPEG, PNG, WEBP, GIF, MP4' })
    }),
    fileSize: z
      .number()
      .positive('File size must be greater than 0')
      .max(52428800, 'File size exceeds maximum limit of 50MB')
  })
});
