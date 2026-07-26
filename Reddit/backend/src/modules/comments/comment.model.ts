import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  parentComment: mongoose.Types.ObjectId | null;
  depth: number;
  score: number;
  replyCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    },
    depth: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 1
    },
    replyCount: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// High-Performance Query Indexes
commentSchema.index({ post: 1, parentComment: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
