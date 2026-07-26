import mongoose, { Schema, Document } from 'mongoose';

export interface ISubredditRule {
  title: string;
  description?: string;
}

export interface ISubreddit extends Document {
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  bannerColor: string;
  creator: mongoose.Types.ObjectId;
  rules: ISubredditRule[];
  members: mongoose.Types.ObjectId[];
  membersCount: number;
}

const ruleSchema = new Schema<ISubredditRule>({
  title: { type: String, required: true },
  description: { type: String, default: '' }
});

const subredditSchema = new Schema<ISubreddit>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'General'
    },
    icon: {
      type: String,
      default: '🌐'
    },
    bannerColor: {
      type: String,
      default: 'linear-gradient(135deg, #ff4500, #ff8700)'
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    rules: [ruleSchema],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    membersCount: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

export const Subreddit = mongoose.model<ISubreddit>('Subreddit', subredditSchema);
