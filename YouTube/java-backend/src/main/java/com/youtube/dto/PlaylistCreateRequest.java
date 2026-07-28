package com.youtube.dto;

import jakarta.validation.constraints.NotBlank;

public class PlaylistCreateRequest {

    @NotBlank(message = "Playlist title is required")
    private String title;

    private Boolean isPrivate;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Boolean getIsPrivate() { return isPrivate; }
    public void setIsPrivate(Boolean isPrivate) { this.isPrivate = isPrivate; }
}
