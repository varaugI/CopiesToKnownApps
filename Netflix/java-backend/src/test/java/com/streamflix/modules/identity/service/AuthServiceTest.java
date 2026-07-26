package com.streamflix.modules.identity.service;

import com.streamflix.common.exception.BusinessValidationException;
import com.streamflix.config.StreamFlixProperties;
import com.streamflix.modules.identity.domain.Account;
import com.streamflix.modules.identity.domain.RefreshSession;
import com.streamflix.modules.identity.dto.LoginRequest;
import com.streamflix.modules.identity.dto.RegisterRequest;
import com.streamflix.modules.identity.repository.AccountRepository;
import com.streamflix.modules.identity.repository.RefreshSessionRepository;
import com.streamflix.modules.profiles.repository.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private RefreshSessionRepository refreshSessionRepository;

    @Mock
    private ProfileRepository profileRepository;

    private PasswordService passwordService;
    private JwtTokenService jwtTokenService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        StreamFlixProperties properties = new StreamFlixProperties();
        properties.getSecurity().setJwtSecret("test_jwt_secret_key_for_junit_tests_streamflix_2026");

        passwordService = new PasswordService();
        jwtTokenService = new JwtTokenService(properties);

        authService = new AuthService(
                accountRepository,
                refreshSessionRepository,
                profileRepository,
                passwordService,
                jwtTokenService,
                properties
        );
    }

    @Test
    void register_CreatesNewAccountAndDefaultProfile() {
        RegisterRequest request = new RegisterRequest("user@example.com", "Password123", "USER");
        given(accountRepository.existsByEmail("user@example.com")).willReturn(false);
        given(accountRepository.save(any(Account.class))).willAnswer(invocation -> invocation.getArgument(0));

        AuthService.AuthResult result = authService.register(request, "JUnit", "127.0.0.1");

        assertThat(result).isNotNull();
        assertThat(result.response().getAccessToken()).isNotBlank();
        assertThat(result.refreshToken()).isNotBlank();
        verify(profileRepository).save(any());
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest request = new RegisterRequest("existing@example.com", "Password123", "USER");
        given(accountRepository.existsByEmail("existing@example.com")).willReturn(true);

        assertThatThrownBy(() -> authService.register(request, "JUnit", "127.0.0.1"))
                .isInstanceOf(BusinessValidationException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void login_InvalidPassword_ThrowsEnumerationResistantException() {
        LoginRequest request = new LoginRequest("user@example.com", "WrongPassword");
        Account account = new Account("user@example.com", passwordService.hashPassword("RealPassword123"), "USER");

        given(accountRepository.findByEmail("user@example.com")).willReturn(Optional.of(account));

        assertThatThrownBy(() -> authService.login(request, "JUnit", "127.0.0.1"))
                .isInstanceOf(BusinessValidationException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    void refreshToken_RevokedToken_TriggersSecurityRevocation() {
        String rawToken = "revoked-token-123";
        String tokenHash = jwtTokenService.hashRefreshToken(rawToken);

        RefreshSession revokedSession = new RefreshSession("acc-1", tokenHash, "JUnit", "127.0.0.1", Instant.now().plusSeconds(3600));
        revokedSession.setRevoked(true);

        given(refreshSessionRepository.findByRefreshTokenHash(tokenHash)).willReturn(Optional.of(revokedSession));

        assertThatThrownBy(() -> authService.refreshToken(rawToken, "JUnit", "127.0.0.1"))
                .isInstanceOf(BusinessValidationException.class)
                .hasMessageContaining("Revoked session reuse detected");

        verify(refreshSessionRepository).revokeAllForAccount("acc-1");
    }
}
