package com.streamflix.modules.identity.dto;

import com.streamflix.modules.identity.domain.Account;
import java.time.Instant;

public class AccountDto {
    private String id;
    private String email;
    private String role;
    private boolean isActive;
    private Instant createdAt;

    public AccountDto() {}

    public AccountDto(Account account) {
        this.id = account.getId();
        this.email = account.getEmail();
        this.role = account.getRole();
        this.isActive = account.isActive();
        this.createdAt = account.getCreatedAt();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
