package com.streamflix.common.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streamflix.common.dto.ApiErrorResponse;
import com.streamflix.modules.ratelimit.service.RateLimitResult;
import com.streamflix.modules.ratelimit.service.RateLimiterService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimiterService rateLimiterService;
    private final ObjectMapper objectMapper;

    public RateLimitingFilter(RateLimiterService rateLimiterService, ObjectMapper objectMapper) {
        this.rateLimiterService = rateLimiterService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();
        String clientIp = getClientIP(request);

        int maxLimit = 100;
        int windowSeconds = 60;

        if (path.startsWith("/api/v1/auth/login") || path.startsWith("/api/v1/auth/register")) {
            maxLimit = 10;
        }

        String rateKey = "ratelimit:" + clientIp + ":" + path;
        RateLimitResult result = rateLimiterService.checkRateLimit(rateKey, maxLimit, windowSeconds);
        if (result == null) {
            result = new RateLimitResult(true, maxLimit, maxLimit - 1, windowSeconds);
        }

        response.setHeader("X-RateLimit-Limit", String.valueOf(result.limit()));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(result.remaining()));
        response.setHeader("X-RateLimit-Reset", String.valueOf(result.resetSeconds()));

        if (!result.allowed()) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

            String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
            ApiErrorResponse errorResponse = new ApiErrorResponse(
                    requestId,
                    HttpStatus.TOO_MANY_REQUESTS.value(),
                    "Too Many Requests",
                    "Rate limit exceeded. Try again in " + result.resetSeconds() + " seconds.",
                    path
            );

            objectMapper.writeValue(response.getWriter(), errorResponse);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isBlank()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
