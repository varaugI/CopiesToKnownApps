import User from '../models/User.js';
import Post from '../models/Post.js';

// @desc Get user profile by username
// @route GET /api/users/:username
export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    if (User.db && User.db.readyState === 1) {
      const user = await User.findOne({ username }).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });

      const userPosts = await Post.find({ author: user._id })
        .populate('subreddit', 'name displayName icon')
        .sort({ createdAt: -1 });

      return res.json({
        user,
        posts: userPosts
      });
    } else {
      return res.json({
        user: {
          _id: 'usr_' + username.toLowerCase(),
          username,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
          bio: 'Reddit enthusiast and open source contributor.',
          postKarma: 245,
          commentKarma: 112,
          createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString()
        },
        posts: []
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
export const updateUserProfile = async (req, res) => {
  try {
    const { bio, avatar } = req.body;

    if (User.db && User.db.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (bio !== undefined) user.bio = bio;
      if (avatar !== undefined) user.avatar = avatar;

      const updatedUser = await user.save();
      return res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        postKarma: updatedUser.postKarma,
        commentKarma: updatedUser.commentKarma
      });
    } else {
      return res.json({
        ...req.user,
        bio: bio || req.user.bio,
        avatar: avatar || req.user.avatar
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Toggle Save Post
// @route POST /api/users/save-post/:postId
export const toggleSavePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (User.db && User.db.readyState === 1) {
      const user = await User.findById(req.user._id);
      const isSaved = user.savedPosts.includes(postId);

      if (isSaved) {
        user.savedPosts.pull(postId);
      } else {
        user.savedPosts.push(postId);
      }

      await user.save();
      return res.json({ isSaved: !isSaved, savedPosts: user.savedPosts });
    } else {
      return res.json({ isSaved: true, savedPosts: [postId] });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
