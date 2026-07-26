import { Router } from 'express';
import {
  getSubredditsHandler,
  getSubredditByNameHandler,
  createSubredditHandler,
  toggleJoinHandler
} from './subreddit.controller.js';
import { protect } from '../auth/auth.middleware.js';

const router = Router();

router.get('/', getSubredditsHandler);
router.get('/:name', getSubredditByNameHandler);
router.post('/', protect, createSubredditHandler);
router.post('/:id/join', protect, toggleJoinHandler);

export default router;
