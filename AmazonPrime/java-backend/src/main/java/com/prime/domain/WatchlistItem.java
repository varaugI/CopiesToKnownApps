package com.prime.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "watchlist_items")
public class WatchlistItem {

    @Id
    private String id;

    private String userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "media_id")
    private MediaContent media;

    public WatchlistItem() {}

    public WatchlistItem(String id, String userId, MediaContent media) {
        this.id = id;
        this.userId = userId;
        this.media = media;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public MediaContent getMedia() { return media; }
    public void setMedia(MediaContent media) { this.media = media; }
}
