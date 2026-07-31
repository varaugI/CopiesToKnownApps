package com.youtube.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "videos")
public class Video {

    @Id
    private String id;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, length = 1000)
    private String videoUrl;

    @Column(nullable = false, length = 1000)
    private String thumbnail;

    private String duration;
    private Long viewsCount;
    private Long likesCount;
    private Long dislikesCount;
    private String category;
    private String uploadedAt;
    private String ambientColor;
    private Boolean isLive;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "channel_id")
    private Channel channel;

    public Video() {}

    public Video(String id, String title, String description, String videoUrl, String thumbnail,
                 String duration, Long viewsCount, Long likesCount, Long dislikesCount,
                 String category, String uploadedAt, String ambientColor, Boolean isLive, Channel channel) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.thumbnail = thumbnail;
        this.duration = duration;
        this.viewsCount = viewsCount;
        this.likesCount = likesCount;
        this.dislikesCount = dislikesCount;
        this.category = category;
        this.uploadedAt = uploadedAt;
        this.ambientColor = ambientColor;
        this.isLive = isLive;
        this.channel = channel;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Long getViewsCount() { return viewsCount; }
    public void setViewsCount(Long viewsCount) { this.viewsCount = viewsCount; }

    public Long getLikesCount() { return likesCount; }
    public void setLikesCount(Long likesCount) { this.likesCount = likesCount; }

    public Long getDislikesCount() { return dislikesCount; }
    public void setDislikesCount(Long dislikesCount) { this.dislikesCount = dislikesCount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; }

    public String getAmbientColor() { return ambientColor; }
    public void setAmbientColor(String ambientColor) { this.ambientColor = ambientColor; }

    public Boolean getIsLive() { return isLive; }
    public void setIsLive(Boolean isLive) { this.isLive = isLive; }

    public Channel getChannel() { return channel; }
    public void setChannel(Channel channel) { this.channel = channel; }
}
