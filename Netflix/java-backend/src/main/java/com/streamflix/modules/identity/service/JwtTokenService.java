package com.streamflix.modules.identity.service;

import com.streamflix.config.StreamFlixProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class JwtTokenService {

    private final StreamFlixProperties properties;
    private final SecretKey signingKey;

    public JwtTokenService(StreamFlixProperties properties) {
        this.properties = properties;
        byte[] keyBytes = properties.getSecurity().getJwtSecret().getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            byte[] paddedKey = new byte[32];
            System.arraycopy(keyBytes, 0, paddedKey, 0, keyBytes.length);
            keyBytes = paddedKey;
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(String accountId, String email, String role) {
        int minutes = properties.getSecurity().getAccessTokenExpirationMinutes();
        Instant now = Instant.now();
        Instant expiresAt = now.plus(minutes, ChronoUnit.MINUTES);

        return Jwts.builder()
                .subject(accountId)
                .claim("email", email)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(signingKey)
                .compact();
    }

    public String generateRefreshToken() {
        return UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
    }

    public String hashRefreshToken(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm missing", e);
        }
    }

    public Claims parseAccessToken(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateAccessToken(String token) {
        try {
            Claims claims = parseAccessToken(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String getAccountIdFromToken(String token) {
        return parseAccessToken(token).getSubject();
    }

    public String getEmailFromToken(String token) {
        return parseAccessToken(token).get("email", String.class);
    }

    public String getRoleFromToken(String token) {
        return parseAccessToken(token).get("role", String.class);
    }
}
