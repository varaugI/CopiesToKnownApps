import { Router } from 'express';
import {
  getPostsHandler,
  getPostByIdHandler,
  createPostHandler,
  votePostHandler,
  votePollHandler
} from './post.controller.js';
import { protect } from '../auth/auth.middleware.js';
import { createRateLimiter } from '../../common/middleware/rate-limiter.middleware.js';

const router = Router();

const postCreateLimiter = createRateLimiter({ prefix: 'posts:create', limit: 10, windowSeconds: 15 * 60 });
const postVoteLimiter = createRateLimiter({ prefix: 'posts:vote', limit: 60, windowSeconds: 60 });

router.get('/', getPostsHandler);
router.get('/:id', getPostByIdHandler);
router.post('/', protect, postCreateLimiter, createPostHandler);
router.post('/:id/vote', protect, postVoteLimiter, votePostHandler);
router.post('/:id/poll', protect, votePollHandler);

export default router;
