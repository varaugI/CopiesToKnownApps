import mongoose from 'mongoose';
import { env } from './env.config.js';
import { logger } from '../common/logging/logger.js';

export const connectDB = async (): Promise<boolean> => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 4000
    });
    logger.info({ host: conn.connection.host }, 'MongoDB Connected Successfully');
    return true;
  } catch (error: any) {
    logger.error({ err: error.message }, 'MongoDB Connection Failed');
    return false;
  }
};

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('MongoDB Disconnected');
  }
};
