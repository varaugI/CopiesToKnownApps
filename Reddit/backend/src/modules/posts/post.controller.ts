import { Request, Response, NextFunction } from 'express';
import {
  getPostsList,
  getPostDetailById,
  createNewPost,
  voteOnPost,
  voteOnPoll
} from './post.service.js';

export const getPostsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subreddit, sort, search, limit, cursor } = req.query;
    const userId = req.user?._id?.toString();

    const parsedLimit = limit ? parseInt(limit as string, 10) : 20;
    const posts = await getPostsList(
      subreddit as string | undefined,
      sort as string | undefined,
      search as string | undefined,
      parsedLimit,
      cursor as string | undefined,
      userId
    );
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const getPostByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id?.toString();
    const post = await getPostDetailById(req.params.id, userId);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const createPostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, type, content, mediaUrl, linkUrl, pollOptions, subredditName, flair, isNSFW, isSpoiler } = req.body;
    const post = await createNewPost(
      req.user._id,
      title,
      subredditName,
      type,
      content,
      mediaUrl,
      linkUrl,
      pollOptions,
      flair,
      isNSFW,
      isSpoiler
    );
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const votePostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { voteType } = req.body;
    const result = await voteOnPost(req.params.id, req.user._id, voteType);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const votePollHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { optionId } = req.body;
    const result = await voteOnPoll(req.params.id, req.user._id, optionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
