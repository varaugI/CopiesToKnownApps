import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Subreddit from '../models/Subreddit.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tentra_social');
    console.log('Clearing old data...');

    await User.deleteMany();
    await Subreddit.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    console.log('Creating seed users...');
    const user1 = await User.create({
      username: 'AlexDev',
      email: 'alex@tentrasocial.com',
      password: 'password123',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AlexDev',
      bio: 'Fullstack developer & Reddit clone maintainer.',
      postKarma: 342,
      commentKarma: 118
    });

    const user2 = await User.create({
      username: 'SarahFrontend',
      email: 'sarah@tentrasocial.com',
      password: 'password123',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=SarahFrontend',
      bio: 'React enthusiast & CSS architecture wizard.',
      postKarma: 188,
      commentKarma: 95
    });

    const user3 = await User.create({
      username: 'QuantumCoder',
      email: 'quantum@tentrasocial.com',
      password: 'password123',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=QuantumCoder',
      bio: 'Exploring AI, physics, and edge computing.',
      postKarma: 512,
      commentKarma: 210
    });

    console.log('Creating subreddits...');
    const subWebdev = await Subreddit.create({
      name: 'webdev',
      displayName: 'Web Development',
      description: 'A community dedicated to all things web development: frontend, backend, tools, frameworks & industry news.',
      category: 'Technology',
      icon: '💻',
      bannerColor: 'linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)',
      creator: user1._id,
      members: [user1._id, user2._id, user3._id],
      membersCount: 14230,
      rules: [
        { title: 'Be Respectful', description: 'Maintain polite and constructive discussions.' },
        { title: 'No Spam', description: 'Self-promotion should be placed in weekly threads.' }
      ]
    });

    const subReact = await Subreddit.create({
      name: 'reactjs',
      displayName: 'React Community',
      description: 'News, articles and discussions regarding the React ecosystem (React.js, React Native, Next.js, Vite).',
      category: 'Programming',
      icon: '⚛️',
      bannerColor: 'linear-gradient(135deg, #00B4DB, #0083B0)',
      creator: user2._id,
      members: [user1._id, user2._id],
      membersCount: 9450,
      rules: [
        { title: 'React specific content', description: 'Posts must involve React or related tools.' }
      ]
    });

    const subTech = await Subreddit.create({
      name: 'technology',
      displayName: 'Technology News & Discussion',
      description: 'The central hub for news, discussions, and advancements in tech, AI, hardware, and software.',
      category: 'Technology',
      icon: '🚀',
      bannerColor: 'linear-gradient(135deg, #FF416C, #FF4B2B)',
      creator: user3._id,
      members: [user1._id, user2._id, user3._id],
      membersCount: 38900
    });

    console.log('Creating posts...');
    const post1 = await Post.create({
      title: 'Welcome to TentraSocial! The next generation MERN Reddit clone built with high performance.',
      type: 'text',
      content: 'TentraSocial brings together real-time nested thread discussions, interactive polls, dynamic community subreddits, and an intuitive dark/light mode experience.',
      author: user1._id,
      subreddit: subWebdev._id,
      subredditName: 'webdev',
      flair: 'Announcement',
      score: 342,
      upvotesCount: 350,
      downvotesCount: 8,
      commentsCount: 3
    });

    const post2 = await Post.create({
      title: 'What frontend state management library are you using for React apps in 2026?',
      type: 'poll',
      content: 'Cast your vote and let us know what setup has given you the best developer experience this year!',
      pollOptions: [
        { text: 'Zustand / Redux Toolkit', votesCount: 145, voters: [user1._id] },
        { text: 'React Context + Hooks', votesCount: 89, voters: [user2._id] },
        { text: 'TanStack Query / SWR', votesCount: 210, voters: [user3._id] },
        { text: 'Jotai / Recoil / Signals', votesCount: 42, voters: [] }
      ],
      pollTotalVotes: 486,
      author: user2._id,
      subreddit: subReact._id,
      subredditName: 'reactjs',
      flair: 'Discussion',
      score: 188,
      upvotesCount: 195,
      downvotesCount: 7,
      commentsCount: 1
    });

    console.log('Creating nested comments...');
    const comment1 = await Comment.create({
      post: post1._id,
      author: user2._id,
      content: 'This Reddit clone interface is exceptionally clean! Glassmorphism combined with quick upvoting feels incredibly responsive.',
      depth: 0,
      score: 42
    });

    const comment2 = await Comment.create({
      post: post1._id,
      author: user1._id,
      parentComment: comment1._id,
      content: 'Appreciate it! The nested thread layout and collapsible replies make long comment chains super easy to follow.',
      depth: 1,
      score: 19
    });

    await Comment.create({
      post: post1._id,
      author: user3._id,
      parentComment: comment2._id,
      content: 'Are you using Mongoose schemas for voting indices? The query performance looks rock solid.',
      depth: 2,
      score: 8
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
