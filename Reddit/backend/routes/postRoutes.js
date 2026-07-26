import express from 'express';
import { getPosts, getPostById, createPost, votePost, votePoll } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', protect, createPost);
router.post('/:id/vote', protect, votePost);
router.post('/:id/poll', protect, votePoll);

export default router;
