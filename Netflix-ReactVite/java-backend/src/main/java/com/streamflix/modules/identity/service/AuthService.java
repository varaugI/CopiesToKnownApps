package com.streamflix.modules.identity.service;

import com.streamflix.common.event.UserRegisteredEvent;
import com.streamflix.common.exception.BusinessValidationException;
import com.streamflix.common.exception.ResourceNotFoundException;
import com.streamflix.config.StreamFlixProperties;
import com.streamflix.modules.identity.domain.Account;
import com.streamflix.modules.identity.domain.RefreshSession;
import com.streamflix.modules.identity.dto.AccountDto;
import com.streamflix.modules.identity.dto.AuthResponse;
import com.streamflix.modules.identity.dto.LoginRequest;
import com.streamflix.modules.identity.dto.RegisterRequest;
import com.streamflix.modules.identity.repository.AccountRepository;
import com.streamflix.modules.identity.repository.RefreshSessionRepository;
import com.streamflix.modules.profiles.domain.Profile;
import com.streamflix.modules.profiles.repository.ProfileRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    private final AccountRepository accountRepository;
    private final RefreshSessionRepository refreshSessionRepository;
    private final ProfileRepository profileRepository;
    private final PasswordService passwordService;
    private final JwtTokenService jwtTokenService;
    private final StreamFlixProperties properties;
    private final ApplicationEventPublisher eventPublisher;

    public AuthService(
            AccountRepository accountRepository,
            RefreshSessionRepository refreshSessionRepository,
            ProfileRepository profileRepository,
            PasswordService passwordService,
            JwtTokenService jwtTokenService,
            StreamFlixProperties properties,
            ApplicationEventPublisher eventPublisher
    ) {
        this.accountRepository = accountRepository;
        this.refreshSessionRepository = refreshSessionRepository;
        this.profileRepository = profileRepository;
        this.passwordService = passwordService;
        this.jwtTokenService = jwtTokenService;
        this.properties = properties;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public AuthResult register(RegisterRequest request, String userAgent, String ipAddress) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (accountRepository.existsByEmail(normalizedEmail)) {
            throw new BusinessValidationException("Account with this email already exists");
        }

        String passwordHash = passwordService.hashPassword(request.getPassword());
        Account account = new Account(normalizedEmail, passwordHash, request.getRole());
        Account savedAccount = accountRepository.save(account);

        // Create default primary profile for newly registered account
        Profile defaultProfile = new Profile(
                savedAccount.getId(),
                "Primary Profile",
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
                "#E50914",
                false,
                "18+",
                null
        );
        profileRepository.save(defaultProfile);

        if (eventPublisher != null) {
            eventPublisher.publishEvent(new UserRegisteredEvent(savedAccount.getId(), savedAccount.getEmail(), Instant.now()));
        }

        return createAuthResult(savedAccount, userAgent, ipAddress);
    }

    @Transactional
    public AuthResult login(LoginRequest request, String userAgent, String ipAddress) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        Account account = accountRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BusinessValidationException("Invalid email or password"));

        if (!passwordService.matches(request.getPassword(), account.getPasswordHash())) {
            throw new BusinessValidationException("Invalid email or password");
        }

        if (!account.isActive()) {
            throw new BusinessValidationException("Account disabled");
        }

        return createAuthResult(account, userAgent, ipAddress);
    }

    @Transactional
    public AuthResult refreshToken(String rawRefreshToken, String userAgent, String ipAddress) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new BusinessValidationException("Missing refresh token");
        }

        String tokenHash = jwtTokenService.hashRefreshToken(rawRefreshToken);
        RefreshSession session = refreshSessionRepository.findByRefreshTokenHash(tokenHash)
                .orElseThrow(() -> new BusinessValidationException("Invalid refresh session"));

        if (session.isRevoked()) {
            refreshSessionRepository.revokeAllForAccount(session.getAccountId());
            throw new BusinessValidationException("Revoked session reuse detected");
        }

        if (session.getExpiresAt().isBefore(Instant.now())) {
            session.setRevoked(true);
            refreshSessionRepository.save(session);
            throw new BusinessValidationException("Refresh session expired");
        }

        session.setRevoked(true);
        refreshSessionRepository.save(session);

        Account account = accountRepository.findById(session.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        return createAuthResult(account, userAgent, ipAddress);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            String tokenHash = jwtTokenService.hashRefreshToken(rawRefreshToken);
            refreshSessionRepository.findByRefreshTokenHash(tokenHash).ifPresent(session -> {
                session.setRevoked(true);
                refreshSessionRepository.save(session);
            });
        }
    }

    @Transactional
    public void logoutAllDevices(String accountId) {
        refreshSessionRepository.revokeAllForAccount(accountId);
    }

    private AuthResult createAuthResult(Account account, String userAgent, String ipAddress) {
        String accessToken = jwtTokenService.generateAccessToken(account.getId(), account.getEmail(), account.getRole());
        String rawRefreshToken = jwtTokenService.generateRefreshToken();
        String tokenHash = jwtTokenService.hashRefreshToken(rawRefreshToken);

        int refreshDays = properties.getSecurity().getRefreshTokenExpirationDays();
        Instant expiresAt = Instant.now().plus(refreshDays, ChronoUnit.DAYS);

        RefreshSession session = new RefreshSession(account.getId(), tokenHash, userAgent, ipAddress, expiresAt);
        refreshSessionRepository.save(session);

        long accessTokenExpiresIn = properties.getSecurity().getAccessTokenExpirationMinutes() * 60L;
        AuthResponse response = new AuthResponse(accessToken, accessTokenExpiresIn, new AccountDto(account));

        return new AuthResult(response, rawRefreshToken);
    }

    public record AuthResult(AuthResponse response, String refreshToken) {}
}
