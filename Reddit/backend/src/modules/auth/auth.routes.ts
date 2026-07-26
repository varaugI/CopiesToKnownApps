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

const router = Router();

router.post('/register', validateRequest(registerSchema), registerHandler);
router.post('/login', validateRequest(loginSchema), loginHandler);
router.post('/refresh', refreshHandler);
router.post('/logout', logoutHandler);
router.post('/logout-all', protect, logoutAllHandler);
router.get('/me', protect, getMeHandler);

export default router;
