import { getIO } from './socket.server.js';
import { logger } from '../logging/logger.js';

export const emitPostVoteUpdate = (postId: string, score: number, upvotesCount: number, downvotesCount: number) => {
  const io = getIO();
  if (!io) return;
  try {
    const room = `post:${postId}`;
    io.to(room).emit('post_voted', {
      postId,
      score,
      upvotesCount,
      downvotesCount,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    logger.warn({ postId, err: err.message }, 'Failed to emit post vote update via Socket.IO');
  }
};

export const emitNewComment = (postId: string, comment: any) => {
  const io = getIO();
  if (!io) return;
  try {
    const room = `post:${postId}`;
    io.to(room).emit('new_comment', {
      postId,
      comment,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    logger.warn({ postId, err: err.message }, 'Failed to emit new comment via Socket.IO');
  }
};
