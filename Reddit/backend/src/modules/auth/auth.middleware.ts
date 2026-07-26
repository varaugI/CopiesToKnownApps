import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config.js';
import { isDbConnected } from '../../config/database.js';
import { User } from '../users/user.model.js';
import { UnauthorizedError, ServiceUnavailableError } from '../../common/errors/app-error.js';

interface JwtPayload {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, _res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

      if (!isDbConnected()) {
        return next(new ServiceUnavailableError('Database service unavailable'));
      }

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new UnauthorizedError('User account no longer exists'));
      }

      req.user = user;
      return next();
    } catch (error) {
      return next(new UnauthorizedError('Not authorized, token invalid or expired'));
    }
  }

  if (!token) {
    return next(new UnauthorizedError('Not authorized, no token provided'));
  }
};
