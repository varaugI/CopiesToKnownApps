import express from 'express';
import { getSubreddits, getSubredditByName, createSubreddit, toggleJoinSubreddit } from '../controllers/subredditController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getSubreddits);
router.get('/:name', getSubredditByName);
router.post('/', protect, createSubreddit);
router.post('/:id/join', protect, toggleJoinSubreddit);

export default router;
