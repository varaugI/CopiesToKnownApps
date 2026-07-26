import { Router } from 'express';
import {
  getPostsHandler,
  getPostByIdHandler,
  createPostHandler,
  votePostHandler,
  votePollHandler
} from './post.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = Router();

router.get('/', getPostsHandler);
router.get('/:id', getPostByIdHandler);
router.post('/', protect, createPostHandler);
router.post('/:id/vote', protect, votePostHandler);
router.post('/:id/poll', protect, votePollHandler);

export default router;
