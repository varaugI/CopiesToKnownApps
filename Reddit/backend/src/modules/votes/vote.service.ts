import mongoose from 'mongoose';
import { Vote } from './vote.model.js';
import { Post } from '../posts/post.model.js';
import { Comment } from '../comments/comment.model.js';
import { isDbConnected } from '../../config/database.js';
import { NotFoundError, ServiceUnavailableError } from '../../common/errors/app-error.js';

export const atomicVoteTarget = async (
  userId: string,
  targetType: 'Post' | 'Comment',
  targetId: string,
  requestedVoteType: number // 1, -1, or 0 (cancel)
) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const targetObjectId = new mongoose.Types.ObjectId(targetId);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Check target existence
  const Model: mongoose.Model<any> = targetType === 'Post' ? Post : Comment;
  const targetDoc = await Model.findById(targetObjectId);
  if (!targetDoc) {
    throw new NotFoundError(`${targetType} not found`);
  }

  // Find existing vote
  const existingVote = await Vote.findOne({
    user: userObjectId,
    targetType,
    targetId: targetObjectId
  });

  let scoreDelta = 0;
  let upDelta = 0;
  let downDelta = 0;
  let finalUserVote = 0;

  if (!existingVote) {
    if (requestedVoteType === 1) {
      scoreDelta = 1;
      upDelta = 1;
      finalUserVote = 1;
      await Vote.create({ user: userObjectId, targetType, targetId: targetObjectId, voteType: 1 });
    } else if (requestedVoteType === -1) {
      scoreDelta = -1;
      downDelta = 1;
      finalUserVote = -1;
      await Vote.create({ user: userObjectId, targetType, targetId: targetObjectId, voteType: -1 });
    }
  } else {
    const currentVoteType = existingVote.voteType;

    if (requestedVoteType === currentVoteType || requestedVoteType === 0) {
      // Cancel vote
      await Vote.deleteOne({ _id: existingVote._id });
      if (currentVoteType === 1) {
        scoreDelta = -1;
        upDelta = -1;
      } else if (currentVoteType === -1) {
        scoreDelta = 1;
        downDelta = -1;
      }
      finalUserVote = 0;
    } else {
      // Switch direction (upvote -> downvote or downvote -> upvote)
      existingVote.voteType = requestedVoteType;
      await existingVote.save();

      if (currentVoteType === 1 && requestedVoteType === -1) {
        scoreDelta = -2;
        upDelta = -1;
        downDelta = 1;
        finalUserVote = -1;
      } else if (currentVoteType === -1 && requestedVoteType === 1) {
        scoreDelta = 2;
        upDelta = 1;
        downDelta = -1;
        finalUserVote = 1;
      }
    }
  }

  // Execute Atomic $inc update on Post/Comment
  const updateQuery: any = { $inc: { score: scoreDelta } };
  if (targetType === 'Post') {
    updateQuery.$inc.upvotesCount = upDelta;
    updateQuery.$inc.downvotesCount = downDelta;
  }

  const updatedDoc: any = await Model.findByIdAndUpdate(
    targetObjectId,
    updateQuery,
    { new: true }
  );

  return {
    score: updatedDoc?.score ?? 0,
    upvotesCount: updatedDoc?.upvotesCount ?? 0,
    downvotesCount: updatedDoc?.downvotesCount ?? 0,
    userVote: finalUserVote
  };
};
