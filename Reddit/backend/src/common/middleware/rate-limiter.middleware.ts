import { Request, Response, NextFunction } from 'express';
import { getRedisClient, isRedisConnected } from '../../config/redis.js';
import { logger } from '../logging/logger.js';
import { AppError } from '../errors/app-error.js';

export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too many requests. Please try again later.') {
    super(message, 429);
  }
}

interface RateLimiterOptions {
  prefix: string;
  limit: number;
  windowSeconds: number;
}

export const createRateLimiter = (options: RateLimiterOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Fail-open: If Redis is offline, allow request to proceed cleanly
    if (!isRedisConnected()) {
      return next();
    }

    const client = getRedisClient();
    if (!client) {
      return next();
    }

    try {
      const identifier = req.user?._id?.toString() || req.ip || 'anonymous';
      const nowSeconds = Math.floor(Date.now() / 1000);
      const windowBucket = Math.floor(nowSeconds / options.windowSeconds);
      const resetTime = (windowBucket + 1) * options.windowSeconds;
      const key = `ratelimit:${options.prefix}:${identifier}:${windowBucket}`;

      const currentCount = await client.incr(key);

      if (currentCount === 1) {
        await client.expireat(key, resetTime);
      }

      const remaining = Math.max(0, options.limit - currentCount);

      // Inject standard RFC Rate-Limit headers
      res.setHeader('X-RateLimit-Limit', options.limit.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader('X-RateLimit-Reset', resetTime.toString());

      if (currentCount > options.limit) {
        const retryAfter = Math.max(1, resetTime - nowSeconds);
        res.setHeader('Retry-After', retryAfter.toString());
        return next(new TooManyRequestsError(`Rate limit exceeded for ${options.prefix}. Try again in ${retryAfter} seconds.`));
      }

      next();
    } catch (err: any) {
      logger.warn({ prefix: options.prefix, err: err.message }, 'Rate limiter failed open due to Redis error.');
      next(); // Fail open
    }
  };
};
