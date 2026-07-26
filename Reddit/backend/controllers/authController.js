import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id, username, email, avatar) => {
  return jwt.sign(
    { id, username, email, avatar },
    process.env.JWT_SECRET || 'tentra_social_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc Register user
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (User.db && User.db.readyState === 1) {
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email or username already exists' });
      }

      const user = await User.create({
        username,
        email,
        password,
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`
      });

      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        postKarma: user.postKarma,
        commentKarma: user.commentKarma,
        token: generateToken(user._id, user.username, user.email, user.avatar)
      });
    } else {
      // Fallback demo auth
      const mockId = 'usr_' + Date.now();
      const userAvatar = avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
      return res.status(201).json({
        _id: mockId,
        username,
        email,
        avatar: userAvatar,
        bio: 'Reddit explorer and community contributor.',
        postKarma: 1,
        commentKarma: 1,
        token: generateToken(mockId, username, email, userAvatar)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Please provide email/username and password' });
    }

    if (User.db && User.db.readyState === 1) {
      const user = await User.findOne({
        $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }]
      });

      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          postKarma: user.postKarma,
          commentKarma: user.commentKarma,
          token: generateToken(user._id, user.username, user.email, user.avatar)
        });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      // Fallback demo login
      const username = emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername;
      const mockId = 'usr_' + username.toLowerCase();
      const userAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
      return res.json({
        _id: mockId,
        username,
        email: `${username}@tentrasocial.com`,
        avatar: userAvatar,
        bio: 'Reddit explorer and community contributor.',
        postKarma: 142,
        commentKarma: 88,
        token: generateToken(mockId, username, `${username}@tentrasocial.com`, userAvatar)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    if (User.db && User.db.readyState === 1) {
      const user = await User.findById(req.user._id).select('-password');
      return res.json(user);
    } else {
      return res.json(req.user);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
