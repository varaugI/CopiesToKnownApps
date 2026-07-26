import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, IUser } from '../users/user.model.js';
import { RefreshToken } from './refresh-token.model.js';
import { env } from '../../config/env.config.js';
import { isDbConnected } from '../../config/database.js';
import { logger } from '../../common/logging/logger.js';
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ServiceUnavailableError,
  NotFoundError
} from '../../common/errors/app-error.js';

const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const hashToken = (rawToken: string): string => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

export const generateAccessToken = (id: string, username: string, email: string, avatar: string): string => {
  return jwt.sign(
    { id, username, email, avatar },
    env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

export const issueSessionTokens = async (
  user: IUser,
  ipAddress?: string,
  userAgent?: string,
  familyId?: string
) => {
  const accessToken = generateAccessToken(
    user._id.toString(),
    user.username,
    user.email,
    user.avatar
  );

  const rawRefreshToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = hashToken(rawRefreshToken);
  const currentFamily = familyId || uuidv4();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

  await RefreshToken.create({
    user: user._id,
    tokenHash,
    familyId: currentFamily,
    isRevoked: false,
    expiresAt,
    ipAddress: ipAddress || '',
    userAgent: userAgent || ''
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      postKarma: user.postKarma,
      commentKarma: user.commentKarma
    }
  };
};

export const registerNewUser = async (
  username: string,
  email: string,
  password: string,
  avatar?: string,
  ipAddress?: string,
  userAgent?: string
) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const normalizedEmail = email.toLowerCase();
  const userExists = await User.findOne({
    $or: [{ email: normalizedEmail }, { username }]
  });

  if (userExists) {
    throw new BadRequestError('User with this email or username already exists');
  }

  const user = await User.create({
    username,
    email: normalizedEmail,
    password,
    avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`
  });

  return await issueSessionTokens(user, ipAddress, userAgent);
};

export const authenticateUser = async (
  emailOrUsername: string,
  password: string,
  ipAddress?: string,
  userAgent?: string
) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const query = emailOrUsername.includes('@')
    ? { email: emailOrUsername.toLowerCase() }
    : { username: emailOrUsername };

  const user = await User.findOne(query);

  if (!user || !(await user.matchPassword(password))) {
    throw new UnauthorizedError('Invalid email/username or password');
  }

  return await issueSessionTokens(user, ipAddress, userAgent);
};

export const rotateRefreshTokenSession = async (
  rawRefreshToken: string,
  ipAddress?: string,
  userAgent?: string
) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  if (!rawRefreshToken) {
    throw new UnauthorizedError('Refresh token required');
  }

  const tokenHash = hashToken(rawRefreshToken);
  const tokenDoc = await RefreshToken.findOne({ tokenHash });

  if (!tokenDoc) {
    throw new UnauthorizedError('Invalid refresh token session');
  }

  // REUSE DETECTION TRIGGER
  if (tokenDoc.isRevoked) {
    logger.warn(
      { userId: tokenDoc.user, familyId: tokenDoc.familyId, ipAddress },
      'SECURITY ALERT: Refresh token reuse detected. Revoking all user sessions.'
    );

    // Invalidate all tokens for this user ID immediately
    await RefreshToken.updateMany({ user: tokenDoc.user }, { isRevoked: true });
    throw new ForbiddenError('Security Alert: Refresh token reuse detected. All active sessions revoked.');
  }

  if (tokenDoc.expiresAt < new Date()) {
    tokenDoc.isRevoked = true;
    await tokenDoc.save();
    throw new UnauthorizedError('Refresh token expired');
  }

  // Mark current token as revoked (used)
  tokenDoc.isRevoked = true;
  await tokenDoc.save();

  const user = await User.findById(tokenDoc.user);
  if (!user) {
    throw new UnauthorizedError('User account no longer exists');
  }

  // Issue new pair preserving family ID
  return await issueSessionTokens(user, ipAddress, userAgent, tokenDoc.familyId);
};

export const revokeSingleSession = async (rawRefreshToken: string) => {
  if (!isDbConnected() || !rawRefreshToken) return;
  const tokenHash = hashToken(rawRefreshToken);
  await RefreshToken.updateOne({ tokenHash }, { isRevoked: true });
};

export const revokeAllUserSessions = async (userId: string) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }
  await RefreshToken.updateMany({ user: userId }, { isRevoked: true });
};

export const getCurrentUserProfile = async (userId: string) => {
  if (!isDbConnected()) {
    throw new ServiceUnavailableError('Database service unavailable');
  }

  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};
