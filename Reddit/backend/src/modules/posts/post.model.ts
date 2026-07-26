import mongoose, { Schema, Document } from 'mongoose';

export interface IPollOption {
  text: string;
  votesCount: number;
  voters: mongoose.Types.ObjectId[];
}

export interface IPost extends Document {
  title: string;
  type: 'text' | 'image' | 'link' | 'poll';
  content: string;
  mediaUrl: string;
  linkUrl: string;
  pollOptions: mongoose.Types.DocumentArray<IPollOption & Document>;
  pollTotalVotes: number;
  flair: string;
  isNSFW: boolean;
  isSpoiler: boolean;
  author: mongoose.Types.ObjectId;
  subreddit: mongoose.Types.ObjectId;
  subredditName: string;
  score: number;
  upvotesCount: number;
  downvotesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const pollOptionSchema = new Schema<IPollOption>({
  text: { type: String, required: true },
  votesCount: { type: Number, default: 0 },
  voters: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['text', 'image', 'link', 'poll'],
      default: 'text'
    },
    content: {
      type: String,
      default: ''
    },
    mediaUrl: {
      type: String,
      default: ''
    },
    linkUrl: {
      type: String,
      default: ''
    },
    pollOptions: [pollOptionSchema],
    pollTotalVotes: {
      type: Number,
      default: 0
    },
    flair: {
      type: String,
      default: ''
    },
    isNSFW: {
      type: Boolean,
      default: false
    },
    isSpoiler: {
      type: Boolean,
      default: false
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subreddit: {
      type: Schema.Types.ObjectId,
      ref: 'Subreddit',
      required: true
    },
    subredditName: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      default: 1
    },
    upvotesCount: {
      type: Number,
      default: 1
    },
    downvotesCount: {
      type: Number,
      default: 0
    },
    commentsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// High-Performance Query Indexes
postSchema.index({ subredditName: 1, createdAt: -1 });
postSchema.index({ subredditName: 1, score: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ score: -1, createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
