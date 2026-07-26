import { Request, Response, NextFunction } from 'express';
import { httpRequestCounter, httpRequestDurationHistogram } from './metrics.js';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startHrTime = process.hrtime.bigint();

  res.on('finish', () => {
    const endHrTime = process.hrtime.bigint();
    const durationSeconds = Number(endHrTime - startHrTime) / 1e9;

    const route = req.route ? req.route.path : req.baseUrl || req.path;
    const method = req.method;
    const statusCode = res.statusCode.toString();

    httpRequestCounter.inc({ method, route, status_code: statusCode });
    httpRequestDurationHistogram.observe({ method, route, status_code: statusCode }, durationSeconds);
  });

  next();
};
