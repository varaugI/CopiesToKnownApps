import mongoose from 'mongoose';

const pollOptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votesCount: { type: Number, default: 0 },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const postSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subreddit: {
    type: mongoose.Schema.Types.ObjectId,
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
  votes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    voteType: { type: Number, enum: [1, -1] }
  }],
  commentsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);
export default Post;
