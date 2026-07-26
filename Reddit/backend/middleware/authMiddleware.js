import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tentra_social_super_secret_jwt_key_2026');
      
      // If MongoDB is connected
      if (User.db && User.db.readyState === 1) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        // Mock fallback user
        req.user = {
          _id: decoded.id,
          username: decoded.username || 'demo_user',
          email: decoded.email || 'demo@tentra.com',
          avatar: decoded.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=DemoUser'
        };
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
