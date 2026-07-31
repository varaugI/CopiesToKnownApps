package com.prime.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "media_content")
public class MediaContent {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    private String tagline;

    @Column(length = 2000)
    private String description;

    @Column(length = 1000)
    private String bgImage;

    @Column(length = 1000)
    private String videoUrl;

    private String badge;
    private String rating;
    private String resolution;
    private String duration;
    private String contentType;
    private Boolean isOriginal;

    public MediaContent() {}

    public MediaContent(String id, String title, String tagline, String description,
                        String bgImage, String videoUrl, String badge, String rating,
                        String resolution, String duration, String contentType, Boolean isOriginal) {
        this.id = id;
        this.title = title;
        this.tagline = tagline;
        this.description = description;
        this.bgImage = bgImage;
        this.videoUrl = videoUrl;
        this.badge = badge;
        this.rating = rating;
        this.resolution = resolution;
        this.duration = duration;
        this.contentType = contentType;
        this.isOriginal = isOriginal;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBgImage() { return bgImage; }
    public void setBgImage(String bgImage) { this.bgImage = bgImage; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public Boolean getIsOriginal() { return isOriginal; }
    public void setIsOriginal(Boolean isOriginal) { this.isOriginal = isOriginal; }
}
