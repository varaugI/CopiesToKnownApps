import { Router } from 'express';
import { getProfileHandler, updateProfileHandler, toggleSavePostHandler } from './user.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = Router();

router.get('/:username', getProfileHandler);
router.put('/profile', protect, updateProfileHandler);
router.post('/save-post/:postId', protect, toggleSavePostHandler);

export default router;
