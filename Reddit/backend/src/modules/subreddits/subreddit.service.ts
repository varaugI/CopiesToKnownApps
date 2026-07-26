import { Subreddit } from './subreddit.model.js';
import { isDbConnected } from '../../config/database.js';
import { BadRequestError, NotFoundError, ServiceUnavailableError } from '../../common/errors/app-error.js';

export const getAllSubreddits = async () => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }
  return await Subreddit.find().sort({ membersCount: -1 });
};

export const getSubredditByName = async (name: string) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }
  const cleanName = name.toLowerCase();
  const sub = await Subreddit.findOne({ name: cleanName }).populate('creator', 'username avatar');
  if (!sub) {
    throw new NotFoundError('Subreddit not found');
  }
  return sub;
};

export const createNewSubreddit = async (
  name: string,
  displayName: string,
  description: string,
  creatorId: string,
  category?: string,
  icon?: string,
  bannerColor?: string,
  rules?: any[]
) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const cleanName = name.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const exists = await Subreddit.findOne({ name: cleanName });
  if (exists) {
    throw new BadRequestError('Subreddit name already exists');
  }

  const subreddit = await Subreddit.create({
    name: cleanName,
    displayName,
    description,
    category: category || 'General',
    icon: icon || '🌐',
    bannerColor: bannerColor || 'linear-gradient(135deg, #ff4500, #ff8700)',
    creator: creatorId,
    rules: rules || [],
    members: [creatorId],
    membersCount: 1
  });

  return subreddit;
};

export const toggleSubredditMembership = async (subId: string, userId: string) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const subreddit = await Subreddit.findById(subId);
  if (!subreddit) {
    throw new NotFoundError('Subreddit not found');
  }

  const isMember = subreddit.members.some(m => m.toString() === userId);

  if (isMember) {
    subreddit.members = subreddit.members.filter(m => m.toString() !== userId);
    subreddit.membersCount = Math.max(0, subreddit.membersCount - 1);
  } else {
    subreddit.members.push(userId as any);
    subreddit.membersCount += 1;
  }

  await subreddit.save();
  return {
    isMember: !isMember,
    membersCount: subreddit.membersCount
  };
};
