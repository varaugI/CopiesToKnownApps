import { Router } from 'express';
import {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  logoutAllHandler,
  getMeHandler
} from './auth.controller.js';
import { validateRequest } from '../../common/middleware/validate.middleware.js';
import { registerSchema, loginSchema } from './auth.validation.js';
import { protect } from './auth.middleware.js';
import { createRateLimiter } from '../../common/middleware/rate-limiter.middleware.js';

const router = Router();

const loginLimiter = createRateLimiter({ prefix: 'auth:login', limit: 5, windowSeconds: 15 * 60 });
const registerLimiter = createRateLimiter({ prefix: 'auth:register', limit: 5, windowSeconds: 60 * 60 });

router.post('/register', registerLimiter, validateRequest(registerSchema), registerHandler);
router.post('/login', loginLimiter, validateRequest(loginSchema), loginHandler);
router.post('/refresh', refreshHandler);
router.post('/logout', logoutHandler);
router.post('/logout-all', protect, logoutAllHandler);
router.get('/me', protect, getMeHandler);

export default router;
