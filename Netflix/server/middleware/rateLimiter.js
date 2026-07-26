import rateLimit from 'express-rate-limit';

// General API Rate Limiter: max 200 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.',
    status: 429
  }
});

// High-Throughput Search Rate Limiter: max 60 searches per minute
export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Search rate limit exceeded. Please wait a moment before typing further.',
    status: 429
  }
});
