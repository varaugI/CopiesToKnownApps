import { Request, Response, NextFunction } from 'express';
import {
  registerNewUser,
  authenticateUser,
  rotateRefreshTokenSession,
  revokeSingleSession,
  revokeAllUserSessions,
  getCurrentUserProfile
} from './auth.service.js';
import { env } from '../../config/env.config.js';

const COOKIE_PATH = '/api/v1/auth';
const REFRESH_COOKIE_NAME = 'refreshToken';

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: COOKIE_PATH
  });
};

const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: COOKIE_PATH
  });
};

export const registerHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password, avatar } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const { accessToken, refreshToken, user } = await registerNewUser(
      username,
      email,
      password,
      avatar,
      ipAddress,
      userAgent
    );

    setRefreshTokenCookie(res, refreshToken);
    res.status(201).json({ accessToken, user });
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { emailOrUsername, password } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const { accessToken, refreshToken, user } = await authenticateUser(
      emailOrUsername,
      password,
      ipAddress,
      userAgent
    );

    setRefreshTokenCookie(res, refreshToken);
    res.json({ accessToken, user });
  } catch (error) {
    next(error);
  }
};

export const refreshHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || (req.headers['x-refresh-token'] as string);
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const { accessToken, refreshToken, user } = await rotateRefreshTokenSession(
      rawRefreshToken,
      ipAddress,
      userAgent
    );

    setRefreshTokenCookie(res, refreshToken);
    res.json({ accessToken, user });
  } catch (error) {
    clearRefreshTokenCookie(res);
    next(error);
  }
};

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || (req.headers['x-refresh-token'] as string);
    await revokeSingleSession(rawRefreshToken);
    clearRefreshTokenCookie(res);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    clearRefreshTokenCookie(res);
    next(error);
  }
};

export const logoutAllHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await revokeAllUserSessions(req.user._id);
    clearRefreshTokenCookie(res);
    res.json({ success: true, message: 'Logged out of all sessions' });
  } catch (error) {
    clearRefreshTokenCookie(res);
    next(error);
  }
};

export const getMeHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getCurrentUserProfile(req.user._id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
