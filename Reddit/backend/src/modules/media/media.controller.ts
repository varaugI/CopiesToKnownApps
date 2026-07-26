import { Request, Response, NextFunction } from 'express';
import { generatePresignedUploadUrl } from './media.service.js';

export const createPresignedUrlHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filename, fileType, fileSize } = req.body;
    const result = await generatePresignedUploadUrl(req.user._id, filename, fileType, fileSize);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
