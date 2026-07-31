package com.youtube.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "playlists")
public class Playlist {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    private Boolean isPrivate;
    private Integer videosCount;

    @Column(length = 1000)
    private String thumbnail;

    public Playlist() {}

    public Playlist(String id, String title, Boolean isPrivate, Integer videosCount, String thumbnail) {
        this.id = id;
        this.title = title;
        this.isPrivate = isPrivate;
        this.videosCount = videosCount;
        this.thumbnail = thumbnail;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Boolean getIsPrivate() { return isPrivate; }
    public void setIsPrivate(Boolean isPrivate) { this.isPrivate = isPrivate; }

    public Integer getVideosCount() { return videosCount; }
    public void setVideosCount(Integer videosCount) { this.videosCount = videosCount; }

    public String getThumbnail() { return thumbnail; }
    public void setThumbnail(String thumbnail) { this.thumbnail = thumbnail; }
}
