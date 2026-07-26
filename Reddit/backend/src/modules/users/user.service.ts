import { User } from './user.model.js';
import { Post } from '../posts/post.model.js';
import { isDbConnected } from '../../config/database.js';
import { NotFoundError, ServiceUnavailableError } from '../../common/errors/app-error.js';

export const getUserProfileByUsername = async (username: string) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const user = await User.findOne({ username }).select('-password');
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const userPosts = await Post.find({ author: user._id })
    .populate('subreddit', 'name displayName icon')
    .sort({ createdAt: -1 });

  return {
    user,
    posts: userPosts
  };
};

export const updateUserProfileData = async (userId: string, bio?: string, avatar?: string) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;

  const updated = await user.save();
  return {
    _id: updated._id,
    username: updated.username,
    email: updated.email,
    avatar: updated.avatar,
    bio: updated.bio,
    postKarma: updated.postKarma,
    commentKarma: updated.commentKarma
  };
};

export const toggleSavePostForUser = async (userId: string, postId: string) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isSaved = user.savedPosts.some(id => id.toString() === postId);

  if (isSaved) {
    user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
  } else {
    user.savedPosts.push(postId as any);
  }

  await user.save();
  return {
    isSaved: !isSaved,
    savedPosts: user.savedPosts
  };
};
