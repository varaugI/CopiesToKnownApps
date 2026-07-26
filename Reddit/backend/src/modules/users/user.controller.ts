import { Request, Response, NextFunction } from 'express';
import { getUserProfileByUsername, updateUserProfileData, toggleSavePostForUser } from './user.service.js';

export const getProfileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getUserProfileByUsername(req.params.username);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const updateProfileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bio, avatar } = req.body;
    const result = await updateUserProfileData(req.user._id, bio, avatar);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const toggleSavePostHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await toggleSavePostForUser(req.user._id, req.params.postId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
