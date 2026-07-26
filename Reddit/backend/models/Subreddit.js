import mongoose from 'mongoose';

const subredditSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: true
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
    default: '🔥'
  },
  bannerColor: {
    type: String,
    default: 'linear-gradient(135deg, #ff4500, #ff8700)'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  membersCount: {
    type: Number,
    default: 1
  },
  rules: [{
    title: String,
    description: String
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const Subreddit = mongoose.model('Subreddit', subredditSchema);
export default Subreddit;
