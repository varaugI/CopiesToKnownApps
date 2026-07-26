import { Router } from 'express';
import {
  getPostCommentsHandler,
  getRepliesHandler,
  createCommentHandler,
  deleteCommentHandler,
  voteCommentHandler
} from './comment.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = Router();

router.get('/post/:postId', getPostCommentsHandler);
router.get('/:commentId/replies', getRepliesHandler);
router.post('/', protect, createCommentHandler);
router.delete('/:id', protect, deleteCommentHandler);
router.post('/:id/vote', protect, voteCommentHandler);

export default router;
