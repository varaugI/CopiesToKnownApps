package com.streamflix.modules.profiles.dto;

import com.streamflix.modules.profiles.domain.Profile;

public class ProfileResponse {
    private String id;
    private String name;
    private String avatarUrl;
    private String colorHex;
    private boolean isKids;
    private String maturityRating;
    private boolean isPinProtected;

    public ProfileResponse() {}

    public ProfileResponse(Profile profile) {
        this.id = profile.getId();
        this.name = profile.getName();
        this.avatarUrl = profile.getAvatarUrl();
        this.colorHex = profile.getColorHex();
        this.isKids = profile.isKids();
        this.maturityRating = profile.getMaturityRating();
        this.isPinProtected = profile.getPinCode() != null && !profile.getPinCode().isBlank();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public boolean isPinProtected() { return isPinProtected; }
    public void setPinProtected(boolean pinProtected) { isPinProtected = pinProtected; }
}
