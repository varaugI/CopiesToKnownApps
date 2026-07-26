package com.streamflix.modules.ratelimit.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class RateLimiterServiceTest {

    private RateLimiterService rateLimiterService;

    @BeforeEach
    void setUp() {
        rateLimiterService = new RateLimiterService(null);
    }

    @Test
    void checkRateLimit_AllowsRequestsWithinLimit() {
        RateLimitResult result1 = rateLimiterService.checkRateLimit("test-key-1", 5, 60);

        assertThat(result1.allowed()).isTrue();
        assertThat(result1.limit()).isEqualTo(5);
        assertThat(result1.remaining()).isEqualTo(4);
    }

    @Test
    void checkRateLimit_BlocksRequestsExceedingLimit() {
        String key = "test-key-exceed";
        for (int i = 0; i < 5; i++) {
            rateLimiterService.checkRateLimit(key, 5, 60);
        }

        RateLimitResult exceedResult = rateLimiterService.checkRateLimit(key, 5, 60);

        assertThat(exceedResult.allowed()).isFalse();
        assertThat(exceedResult.remaining()).isEqualTo(0);
    }
}
