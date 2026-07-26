import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  user: mongoose.Types.ObjectId;
  targetType: 'Post' | 'Comment';
  targetId: mongoose.Types.ObjectId;
  voteType: number; // 1 for upvote, -1 for downvote
  createdAt: Date;
  updatedAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    targetType: {
      type: String,
      enum: ['Post', 'Comment'],
      required: true
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    },
    voteType: {
      type: Number,
      enum: [1, -1],
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Unique Compound Index: Enforces exactly ONE vote per user per post/comment
voteSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });

export const Vote = mongoose.model<IVote>('Vote', voteSchema);
