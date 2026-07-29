package com.streamflix.modules.profiles.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "profiles", uniqueConstraints = {
    @UniqueConstraint(name = "uk_account_profile_name", columnNames = {"account_id", "name"})
})
public class Profile {

    @Id
    private String id;

    @Column(name = "account_id", nullable = false)
    private String accountId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "avatar_url", nullable = false, length = 500)
    private String avatarUrl;

    @Column(name = "color_hex", nullable = false, length = 20)
    private String colorHex = "#E50914";

    @Column(name = "is_kids", nullable = false)
    private boolean isKids = false;

    @Column(name = "maturity_rating", nullable = false, length = 20)
    private String maturityRating = "18+";

    @Column(name = "pin_code", length = 10)
    private String pinCode;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public Profile() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public Profile(String accountId, String name, String avatarUrl, String colorHex, boolean isKids, String maturityRating, String pinCode) {
        this();
        this.accountId = accountId;
        this.name = name;
        this.avatarUrl = avatarUrl;
        if (colorHex != null) this.colorHex = colorHex;
        this.isKids = isKids;
        if (maturityRating != null) this.maturityRating = maturityRating;
        this.pinCode = pinCode;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAccountId() { return accountId; }
    public void setAccountId(String accountId) { this.accountId = accountId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public String getColorHex() { return colorHex; }
    public void setColorHex(String colorHex) { this.colorHex = colorHex; }

    public boolean isKids() { return isKids; }
    public void setKids(boolean kids) { isKids = kids; }

    public String getMaturityRating() { return maturityRating; }
    public void setMaturityRating(String maturityRating) { this.maturityRating = maturityRating; }

    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
