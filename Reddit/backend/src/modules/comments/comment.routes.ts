import { Router } from 'express';
import {
  getPostCommentsHandler,
  getRepliesHandler,
  createCommentHandler,
  deleteCommentHandler,
  voteCommentHandler
} from './comment.controller.js';
import { protect } from '../auth/auth.middleware.js';
import { createRateLimiter } from '../../common/middleware/rate-limiter.middleware.js';

const router = Router();

const commentCreateLimiter = createRateLimiter({ prefix: 'comments:create', limit: 20, windowSeconds: 15 * 60 });
const commentVoteLimiter = createRateLimiter({ prefix: 'comments:vote', limit: 60, windowSeconds: 60 });

router.get('/post/:postId', getPostCommentsHandler);
router.get('/:commentId/replies', getRepliesHandler);
router.post('/', protect, commentCreateLimiter, createCommentHandler);
router.delete('/:id', protect, deleteCommentHandler);
router.post('/:id/vote', protect, commentVoteLimiter, voteCommentHandler);

export default router;
