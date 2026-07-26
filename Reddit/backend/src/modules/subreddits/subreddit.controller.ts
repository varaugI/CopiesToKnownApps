import { Request, Response, NextFunction } from 'express';
import {
  getAllSubreddits,
  getSubredditByName,
  createNewSubreddit,
  toggleSubredditMembership
} from './subreddit.service.js';

export const getSubredditsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subreddits = await getAllSubreddits();
    res.json(subreddits);
  } catch (error) {
    next(error);
  }
};

export const getSubredditByNameHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subreddit = await getSubredditByName(req.params.name);
    res.json(subreddit);
  } catch (error) {
    next(error);
  }
};

export const createSubredditHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, displayName, description, category, icon, bannerColor, rules } = req.body;
    const subreddit = await createNewSubreddit(
      name,
      displayName,
      description,
      req.user._id,
      category,
      icon,
      bannerColor,
      rules
    );
    res.status(201).json(subreddit);
  } catch (error) {
    next(error);
  }
};

export const toggleJoinHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await toggleSubredditMembership(req.params.id, req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
