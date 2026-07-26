package com.streamflix.modules.identity.dto;

public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private long expiresInSeconds;
    private AccountDto account;

    public AuthResponse() {}

    public AuthResponse(String accessToken, long expiresInSeconds, AccountDto account) {
        this.accessToken = accessToken;
        this.expiresInSeconds = expiresInSeconds;
        this.account = account;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public long getExpiresInSeconds() { return expiresInSeconds; }
    public void setExpiresInSeconds(long expiresInSeconds) { this.expiresInSeconds = expiresInSeconds; }

    public AccountDto getAccount() { return account; }
    public void setAccount(AccountDto account) { this.account = account; }
}
