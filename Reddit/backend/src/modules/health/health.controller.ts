import { Request, Response } from 'express';
import { isDbConnected } from '../../config/database.js';

export const getLiveness = (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
};

export const getReadiness = (req: Request, res: Response) => {
  const dbConnected = isDbConnected();
  
  if (!dbConnected) {
    return res.status(503).json({
      status: 'unready',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }

  res.json({
    status: 'ready',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
};
