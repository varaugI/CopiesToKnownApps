package com.streamflix.modules.identity.controller;

import com.streamflix.common.dto.ApiResponse;
import com.streamflix.common.filter.RequestIdFilter;
import com.streamflix.modules.identity.dto.AuthResponse;
import com.streamflix.modules.identity.dto.LoginRequest;
import com.streamflix.modules.identity.dto.RegisterRequest;
import com.streamflix.modules.identity.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.MDC;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    public static final String REFRESH_COOKIE_NAME = "refreshToken";
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        String userAgent = httpRequest.getHeader(HttpHeaders.USER_AGENT);
        String ipAddress = httpRequest.getRemoteAddr();

        AuthService.AuthResult result = authService.register(request, userAgent, ipAddress);
        attachRefreshCookie(response, result.refreshToken(), 7 * 24 * 60 * 60);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(result.response(), requestId));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse response
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        String userAgent = httpRequest.getHeader(HttpHeaders.USER_AGENT);
        String ipAddress = httpRequest.getRemoteAddr();

        AuthService.AuthResult result = authService.login(request, userAgent, ipAddress);
        attachRefreshCookie(response, result.refreshToken(), 7 * 24 * 60 * 60);

        return ResponseEntity.ok(ApiResponse.of(result.response(), requestId));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            HttpServletRequest httpRequest,
            HttpServletResponse response
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        String rawRefreshToken = extractRefreshCookie(httpRequest);
        String userAgent = httpRequest.getHeader(HttpHeaders.USER_AGENT);
        String ipAddress = httpRequest.getRemoteAddr();

        AuthService.AuthResult result = authService.refreshToken(rawRefreshToken, userAgent, ipAddress);
        attachRefreshCookie(response, result.refreshToken(), 7 * 24 * 60 * 60);

        return ResponseEntity.ok(ApiResponse.of(result.response(), requestId));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Map<String, String>>> logout(
            HttpServletRequest httpRequest,
            HttpServletResponse response
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        String rawRefreshToken = extractRefreshCookie(httpRequest);

        authService.logout(rawRefreshToken);
        attachRefreshCookie(response, "", 0);

        return ResponseEntity.ok(ApiResponse.of(Map.of("message", "Logged out successfully"), requestId));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<Map<String, String>>> logoutAll(
            @AuthenticationPrincipal String accountId,
            HttpServletResponse response
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        authService.logoutAllDevices(accountId);
        attachRefreshCookie(response, "", 0);

        return ResponseEntity.ok(ApiResponse.of(Map.of("message", "Logged out from all devices"), requestId));
    }

    private void attachRefreshCookie(HttpServletResponse response, String token, long maxAgeSeconds) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE_NAME, token)
                .httpOnly(true)
                .secure(false)
                .path("/api/v1/auth")
                .maxAge(maxAgeSeconds)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String extractRefreshCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> REFRESH_COOKIE_NAME.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
