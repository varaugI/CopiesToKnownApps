import express from 'express';
import { getUserProfile, updateUserProfile, toggleSavePost } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:username', getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/save-post/:postId', protect, toggleSavePost);

export default router;
