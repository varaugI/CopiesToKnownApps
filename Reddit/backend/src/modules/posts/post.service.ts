import mongoose from 'mongoose';
import { Post } from './post.model.js';
import { Subreddit } from '../subreddits/subreddit.model.js';
import { User } from '../users/user.model.js';
import { Vote } from '../votes/vote.model.js';
import { atomicVoteTarget } from '../votes/vote.service.js';
import { isDbConnected } from '../../config/database.js';
import { BadRequestError, NotFoundError, ServiceUnavailableError } from '../../common/errors/app-error.js';

export const getPostsList = async (
  subreddit?: string,
  sort: string = 'hot',
  search?: string,
  limit: number = 20,
  cursor?: string,
  userId?: string
) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const query: any = {};
  if (subreddit) {
    query.subredditName = subreddit.toLowerCase();
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  if (cursor && mongoose.Types.ObjectId.isValid(cursor)) {
    query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
  }

  let sortOptions: any = { _id: -1 };
  if (sort === 'top') sortOptions = { score: -1, _id: -1 };
  if (sort === 'hot') sortOptions = { score: -1, createdAt: -1, _id: -1 };

  const parsedLimit = Math.min(Math.max(1, limit), 50);
  const posts = await Post.find(query)
    .populate('author', 'username avatar')
    .populate('subreddit', 'name displayName icon bannerColor')
    .sort(sortOptions)
    .limit(parsedLimit + 1)
    .lean();

  const hasMore = posts.length > parsedLimit;
  const items = hasMore ? posts.slice(0, parsedLimit) : posts;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1]._id.toString() : null;

  // Populate userVote map for authenticated requests
  if (userId && items.length > 0) {
    const postIds = items.map(p => p._id);
    const votes = await Vote.find({
      user: new mongoose.Types.ObjectId(userId),
      targetType: 'Post',
      targetId: { $in: postIds }
    }).lean();

    const voteMap = new Map(votes.map(v => [v.targetId.toString(), v.voteType]));
    items.forEach((p: any) => {
      p.userVote = voteMap.get(p._id.toString()) || 0;
    });
  }

  return {
    items,
    nextCursor,
    hasMore
  };
};

export const searchPostsService = async (queryText: string, limit: number = 20, cursor?: string, userId?: string) => {
  return await getPostsList(undefined, 'hot', queryText, limit, cursor, userId);
};

export const getPostDetailById = async (id: string, userId?: string) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const post: any = await Post.findById(id)
    .populate('author', 'username avatar bio postKarma')
    .populate('subreddit', 'name displayName icon description membersCount rules')
    .lean();

  if (!post) {
    throw new NotFoundError('Post not found');
  }

  if (userId) {
    const vote = await Vote.findOne({
      user: new mongoose.Types.ObjectId(userId),
      targetType: 'Post',
      targetId: new mongoose.Types.ObjectId(id)
    }).lean();

    post.userVote = vote ? vote.voteType : 0;
  }

  return post;
};

export const createNewPost = async (
  userId: string,
  title: string,
  subredditName: string,
  type: 'text' | 'image' | 'link' | 'poll' = 'text',
  content?: string,
  mediaUrl?: string,
  linkUrl?: string,
  pollOptions?: string[],
  flair?: string,
  isNSFW?: boolean,
  isSpoiler?: boolean
) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const subreddit = await Subreddit.findOne({ name: subredditName.toLowerCase() });
  if (!subreddit) {
    throw new NotFoundError('Target subreddit does not exist');
  }

  let formattedPoll: any[] = [];
  if (type === 'poll' && Array.isArray(pollOptions)) {
    formattedPoll = pollOptions.filter(opt => typeof opt === 'string' && opt.trim()).map(text => ({ text, votesCount: 0, voters: [] }));
  }

  const post = await Post.create({
    title,
    type,
    content: content || '',
    mediaUrl: mediaUrl || '',
    linkUrl: linkUrl || '',
    pollOptions: formattedPoll,
    flair: flair || '',
    isNSFW: !!isNSFW,
    isSpoiler: !!isSpoiler,
    author: userId,
    subreddit: subreddit._id,
    subredditName: subreddit.name,
    upvotesCount: 1,
    downvotesCount: 0,
    score: 1
  });

  // Automatically create author's initial upvote in Vote collection
  await Vote.create({
    user: userId,
    targetType: 'Post',
    targetId: post._id,
    voteType: 1
  });

  await User.findByIdAndUpdate(userId, { $inc: { postKarma: 1 } });

  const populated: any = await Post.findById(post._id)
    .populate('author', 'username avatar')
    .populate('subreddit', 'name displayName icon')
    .lean();

  populated.userVote = 1;
  return populated;
};

export const voteOnPost = async (postId: string, userId: string, voteType: number) => {
  return await atomicVoteTarget(userId, 'Post', postId, voteType);
};

export const voteOnPoll = async (postId: string, userId: string, optionId: string) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const post = await Post.findById(postId);
  if (!post || post.type !== 'poll') {
    throw new BadRequestError('Invalid poll post');
  }

  const option = post.pollOptions.id(optionId);
  if (!option) {
    throw new NotFoundError('Poll option not found');
  }

  const hasVoted = post.pollOptions.some(opt => opt.voters.some(v => v.toString() === userId));
  if (hasVoted) {
    throw new BadRequestError('You have already voted in this poll');
  }

  option.votesCount += 1;
  option.voters.push(userId as any);
  post.pollTotalVotes += 1;

  await post.save();
  return post;
};
