import { ApiError } from "@/server/errors";

interface RateLimitBucket {
  timestamps: number[];
}

export interface RateLimitOptions {
  scope: string;
  actorId: string;
  limit?: number;
  windowMs?: number;
  now?: number;
}

const buckets = new Map<string, RateLimitBucket>();
const MAX_BUCKETS = 1_000;

function pruneBuckets(now: number, windowMs: number): void {
  const cutoff = now - windowMs;
  buckets.forEach((bucket, key) => {
    bucket.timestamps = bucket.timestamps.filter((timestamp) => timestamp > cutoff);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  });

  while (buckets.size >= MAX_BUCKETS) {
    const oldestKey = buckets.keys().next().value as string | undefined;
    if (!oldestKey) break;
    buckets.delete(oldestKey);
  }
}

function clientKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return (
    request.headers.get("cf-connecting-ip")?.trim() ||
    forwardedFor?.split(",")[0]?.trim() ||
    "local"
  );
}

export function enforceRateLimit(
  request: Request,
  {
    scope,
    actorId,
    limit = 30,
    windowMs = 60_000,
    now = Date.now(),
  }: RateLimitOptions,
): void {
  if (buckets.size >= MAX_BUCKETS) pruneBuckets(now, windowMs);
  const key = `${scope}:${actorId}:${clientKey(request)}`;
  const cutoff = now - windowMs;
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((timestamp) => timestamp > cutoff);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000),
    );
    throw new ApiError({
      status: 429,
      code: "RATE_LIMITED",
      message: "Too many requests. Please try again shortly.",
      details: {
        scope,
        limit,
        retryAfterSeconds,
      },
      headers: {
        "retry-after": String(retryAfterSeconds),
      },
    });
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
}

export function resetRateLimitsForTests(): void {
  buckets.clear();
}
