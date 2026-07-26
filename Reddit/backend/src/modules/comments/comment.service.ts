import mongoose from 'mongoose';
import { Comment } from './comment.model.js';
import { Post } from '../posts/post.model.js';
import { User } from '../users/user.model.js';
import { Vote } from '../votes/vote.model.js';
import { atomicVoteTarget } from '../votes/vote.service.js';
import { isDbConnected } from '../../config/database.js';
import { BadRequestError, NotFoundError, ForbiddenError, ServiceUnavailableError } from '../../common/errors/app-error.js';

const MAX_DEPTH = 5;

export const getTopLevelCommentsForPost = async (
  postId: string,
  limit: number = 20,
  cursor?: string,
  userId?: string
) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const query: any = {
    post: new mongoose.Types.ObjectId(postId),
    parentComment: null
  };

  if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  const parsedLimit = Math.min(Math.max(1, limit), 50);
  const comments = await Comment.find(query)
    .populate('author', 'username avatar')
    .sort({ createdAt: -1, _id: -1 })
    .limit(parsedLimit + 1)
    .lean();

  const hasMore = comments.length > parsedLimit;
  const items = hasMore ? comments.slice(0, parsedLimit) : comments;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1]._id.toString() : null;

  if (userId && items.length > 0) {
    const commentIds = items.map(c => c._id);
    const votes = await Vote.find({
      user: new mongoose.Types.ObjectId(userId),
      targetType: 'Comment',
      targetId: { $in: commentIds }
    }).lean();

    const voteMap = new Map(votes.map(v => [v.targetId.toString(), v.voteType]));
    items.forEach((c: any) => {
      c.userVote = voteMap.get(c._id.toString()) || 0;
    });
  }

  return {
    items,
    nextCursor,
    hasMore
  };
};

export const getRepliesForComment = async (
  parentCommentId: string,
  limit: number = 20,
  cursor?: string,
  userId?: string
) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const query: any = {
    parentComment: new mongoose.Types.ObjectId(parentCommentId)
  };

  if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  const parsedLimit = Math.min(Math.max(1, limit), 50);
  const replies = await Comment.find(query)
    .populate('author', 'username avatar')
    .sort({ createdAt: 1, _id: 1 })
    .limit(parsedLimit + 1)
    .lean();

  const hasMore = replies.length > parsedLimit;
  const items = hasMore ? replies.slice(0, parsedLimit) : replies;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1]._id.toString() : null;

  if (userId && items.length > 0) {
    const replyIds = items.map(r => r._id);
    const votes = await Vote.find({
      user: new mongoose.Types.ObjectId(userId),
      targetType: 'Comment',
      targetId: { $in: replyIds }
    }).lean();

    const voteMap = new Map(votes.map(v => [v.targetId.toString(), v.voteType]));
    items.forEach((r: any) => {
      r.userVote = voteMap.get(r._id.toString()) || 0;
    });
  }

  return {
    items,
    nextCursor,
    hasMore
  };
};

export const createNewComment = async (
  userId: string,
  postId: string,
  content: string,
  parentCommentId?: string
) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  if (!postId || !content) {
    throw new BadRequestError('Post ID and content are required');
  }

  let depth = 0;
  if (parentCommentId) {
    const parent = await Comment.findById(parentCommentId);
    if (!parent) {
      throw new NotFoundError('Parent comment not found');
    }
    depth = Math.min(parent.depth + 1, MAX_DEPTH);
  }

  const comment = await Comment.create({
    post: postId,
    author: userId,
    content,
    parentComment: parentCommentId || null,
    depth,
    score: 1,
    replyCount: 0,
    isDeleted: false
  });

  // Increment reply count on parent comment if replying
  if (parentCommentId) {
    await Comment.findByIdAndUpdate(parentCommentId, { $inc: { replyCount: 1 } });
  }

  // Increment post comment count
  await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

  // Add author's initial vote
  await Vote.create({
    user: userId,
    targetType: 'Comment',
    targetId: comment._id,
    voteType: 1
  });

  await User.findByIdAndUpdate(userId, { $inc: { commentKarma: 1 } });

  const populated: any = await Comment.findById(comment._id).populate('author', 'username avatar').lean();
  populated.userVote = 1;
  return populated;
};

export const deleteCommentTombstone = async (commentId: string, userId: string) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new NotFoundError('Comment not found');
  }

  if (comment.author.toString() !== userId) {
    throw new ForbiddenError('Not authorized to delete this comment');
  }

  comment.content = '[comment deleted]';
  comment.isDeleted = true;
  await comment.save();

  return { success: true, message: 'Comment deleted successfully' };
};

export const voteOnComment = async (commentId: string, userId: string, voteType: number) => {
  return await atomicVoteTarget(userId, 'Comment', commentId, voteType);
};
