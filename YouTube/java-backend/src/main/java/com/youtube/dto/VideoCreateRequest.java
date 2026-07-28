package com.youtube.dto;

import jakarta.validation.constraints.NotBlank;

public class VideoCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String videoUrl;
    private String thumbnail;
    private String category;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
