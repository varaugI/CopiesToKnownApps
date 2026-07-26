import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const existingHeader = req.headers['x-request-id'];
  const requestId = Array.isArray(existingHeader) ? existingHeader[0] : (existingHeader || uuidv4());
  
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
};
