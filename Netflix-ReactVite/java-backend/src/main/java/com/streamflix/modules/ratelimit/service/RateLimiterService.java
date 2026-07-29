package com.streamflix.modules.ratelimit.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RateLimiterService {

    private final StringRedisTemplate redisTemplate;
    private final Map<String, LocalWindowCounter> fallbackCounters = new ConcurrentHashMap<>();

    public RateLimiterService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public RateLimitResult checkRateLimit(String key, int maxLimit, int windowSeconds) {
        try {
            if (redisTemplate != null) {
                Long current = redisTemplate.opsForValue().increment(key);
                if (current != null && current == 1) {
                    redisTemplate.expire(key, Duration.ofSeconds(windowSeconds));
                }
                Long ttl = redisTemplate.getExpire(key);
                int count = current != null ? current.intValue() : 1;
                int remaining = Math.max(0, maxLimit - count);
                boolean allowed = count <= maxLimit;
                return new RateLimitResult(allowed, maxLimit, remaining, ttl != null && ttl > 0 ? ttl : windowSeconds);
            }
        } catch (Exception ignored) {
            // Fallback gracefully to in-memory window counter if Redis connection is unavailable
        }

        long nowSeconds = System.currentTimeMillis() / 1000;
        long windowBucket = nowSeconds / windowSeconds;
        String bucketKey = key + ":" + windowBucket;

        LocalWindowCounter counter = fallbackCounters.computeIfAbsent(bucketKey, k -> new LocalWindowCounter(nowSeconds + windowSeconds));
        int currentCount = counter.count.incrementAndGet();
        long resetSeconds = Math.max(1, counter.expiresAt - nowSeconds);
        int remaining = Math.max(0, maxLimit - currentCount);
        boolean allowed = currentCount <= maxLimit;

        return new RateLimitResult(allowed, maxLimit, remaining, resetSeconds);
    }

    private static class LocalWindowCounter {
        final AtomicInteger count = new AtomicInteger(0);
        final long expiresAt;

        LocalWindowCounter(long expiresAt) {
            this.expiresAt = expiresAt;
        }
    }
}
