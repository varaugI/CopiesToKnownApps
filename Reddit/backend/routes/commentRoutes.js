import express from 'express';
import { getPostComments, createComment, voteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/post/:postId', getPostComments);
router.post('/', protect, createComment);
router.post('/:id/vote', protect, voteComment);

export default router;
