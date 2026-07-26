package com.streamflix.modules.profiles.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateProfileRequest {

    @NotBlank(message = "Profile name is required")
    @Size(max = 50, message = "Profile name must not exceed 50 characters")
    private String name;

    @NotBlank(message = "Avatar URL is required")
    private String avatarUrl;

    private String colorHex = "#E50914";
    private boolean isKids = false;
    private String maturityRating = "18+";
    private String pinCode;

    public CreateProfileRequest() {}

    public CreateProfileRequest(String name, String avatarUrl, String colorHex, boolean isKids, String maturityRating, String pinCode) {
        this.name = name;
        this.avatarUrl = avatarUrl;
        if (colorHex != null) this.colorHex = colorHex;
        this.isKids = isKids;
        if (maturityRating != null) this.maturityRating = maturityRating;
        this.pinCode = pinCode;
    }

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
}
