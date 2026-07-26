import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../modules/users/user.model.js';
import { Subreddit } from '../modules/subreddits/subreddit.model.js';
import { Post } from '../modules/posts/post.model.js';
import { Comment } from '../modules/comments/comment.model.js';
import { env } from '../config/env.config.js';
import { logger } from '../common/logging/logger.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await Subreddit.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    const admin = await User.create({
      username: 'AlexDev',
      email: 'alex@tentrasocial.com',
      password: hashedPassword,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlexDev',
      bio: 'Lead developer on TentraSocial.',
      postKarma: 342,
      commentKarma: 119
    });

    const sarah = await User.create({
      username: 'SarahFrontend',
      email: 'sarah@tentrasocial.com',
      password: hashedPassword,
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SarahFrontend',
      bio: 'UI/UX Specialist and React Developer.',
      postKarma: 188,
      commentKarma: 42
    });

    const webdevSub = await Subreddit.create({
      name: 'webdev',
      displayName: 'Web Development',
      description: 'A community dedicated to all things web development: frontend, backend, tools, frameworks & industry news.',
      category: 'Technology',
      icon: '💻',
      bannerColor: 'linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)',
      creator: admin._id,
      members: [admin._id, sarah._id],
      membersCount: 14230,
      rules: [
        { title: 'Be Respectful', description: 'Maintain polite and constructive discussions.' },
        { title: 'No Spam', description: 'Self-promotion should be placed in weekly threads.' }
      ]
    });

    const reactSub = await Subreddit.create({
      name: 'reactjs',
      displayName: 'React Community',
      description: 'News, articles and discussions regarding the React ecosystem.',
      category: 'Programming',
      icon: '⚛️',
      bannerColor: 'linear-gradient(135deg, #00B4DB, #0083B0)',
      creator: sarah._id,
      members: [sarah._id],
      membersCount: 9450
    });

    const post1 = await Post.create({
      title: 'Welcome to TentraSocial! High performance Reddit modular monolith.',
      type: 'text',
      content: 'TentraSocial brings together real-time thread discussions, interactive polls, dynamic subreddits, and structured logging.',
      author: admin._id,
      subreddit: webdevSub._id,
      subredditName: webdevSub.name,
      flair: 'Announcement',
      score: 342,
      upvotesCount: 350,
      downvotesCount: 8,
      commentsCount: 2,
      votes: [{ user: admin._id, voteType: 1 }]
    });

    const comment1 = await Comment.create({
      post: post1._id,
      author: sarah._id,
      content: 'This modular monolith interface is exceptionally clean!',
      score: 42,
      depth: 0,
      votes: [{ user: sarah._id, voteType: 1 }]
    });

    await Comment.create({
      post: post1._id,
      author: admin._id,
      content: 'Appreciate it! The nested thread layout makes comment chains super easy to follow.',
      parentComment: comment1._id,
      depth: 1,
      score: 19,
      votes: [{ user: admin._id, voteType: 1 }]
    });

    logger.info('Database Seeded Successfully!');
    process.exit(0);
  } catch (error: any) {
    logger.error({ err: error.message }, 'Database Seed Failed');
    process.exit(1);
  }
};

seedDatabase();
