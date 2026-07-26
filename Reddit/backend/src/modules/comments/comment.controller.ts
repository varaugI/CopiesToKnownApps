import { Request, Response, NextFunction } from 'express';
import {
  getTopLevelCommentsForPost,
  getRepliesForComment,
  createNewComment,
  deleteCommentTombstone,
  voteOnComment
} from './comment.service.js';

export const getPostCommentsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, cursor } = req.query;
    const userId = req.user?._id?.toString();
    const parsedLimit = limit ? parseInt(limit as string, 10) : 20;

    const comments = await getTopLevelCommentsForPost(
      req.params.postId,
      parsedLimit,
      cursor as string | undefined,
      userId
    );
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const getRepliesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, cursor } = req.query;
    const userId = req.user?._id?.toString();
    const parsedLimit = limit ? parseInt(limit as string, 10) : 20;

    const replies = await getRepliesForComment(
      req.params.commentId,
      parsedLimit,
      cursor as string | undefined,
      userId
    );
    res.json(replies);
  } catch (error) {
    next(error);
  }
};

export const createCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId, content, parentCommentId } = req.body;
    const comment = await createNewComment(req.user._id, postId, content, parentCommentId);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await deleteCommentTombstone(req.params.id, req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const voteCommentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { voteType } = req.body;
    const result = await voteOnComment(req.params.id, req.user._id, voteType);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
