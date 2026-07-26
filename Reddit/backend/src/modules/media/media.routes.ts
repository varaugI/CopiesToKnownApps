import { Router } from 'express';
import { createPresignedUrlHandler } from './media.controller.js';
import { protect } from '../auth/auth.middleware.js';
import { validateRequest } from '../../common/middleware/validate.middleware.js';
import { presignedUrlSchema } from './media.validation.js';
import { createRateLimiter } from '../../common/middleware/rate-limiter.middleware.js';

const router = Router();
const presignedUrlLimiter = createRateLimiter({ prefix: 'media:presigned', limit: 20, windowSeconds: 15 * 60 });

router.post('/presigned-url', protect, presignedUrlLimiter, validateRequest(presignedUrlSchema), createPresignedUrlHandler);

export default router;
