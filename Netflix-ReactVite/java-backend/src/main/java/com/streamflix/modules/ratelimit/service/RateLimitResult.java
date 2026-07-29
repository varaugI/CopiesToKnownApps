package com.streamflix.modules.ratelimit.service;

public record RateLimitResult(boolean allowed, int limit, int remaining, long resetSeconds) {}
