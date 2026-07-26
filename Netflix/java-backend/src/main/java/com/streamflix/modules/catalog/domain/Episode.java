package com.streamflix.modules.catalog.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "episodes")
public class Episode {

    @Id
    private String id;

    @Column(name = "season_id", nullable = false)
    private String seasonId;

    @Column(name = "episode_number", nullable = false)
    private Integer episodeNumber;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String overview;

    @Column(name = "duration_seconds", nullable = false)
    private Integer durationSeconds;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "media_asset_id", length = 36)
    private String mediaAssetId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Episode() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
    }

    public Episode(String seasonId, Integer episodeNumber, String title, String overview, Integer durationSeconds, String thumbnailUrl) {
        this();
        this.seasonId = seasonId;
        this.episodeNumber = episodeNumber;
        this.title = title;
        this.overview = overview;
        this.durationSeconds = durationSeconds;
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSeasonId() { return seasonId; }
    public void setSeasonId(String seasonId) { this.seasonId = seasonId; }

    public Integer getEpisodeNumber() { return episodeNumber; }
    public void setEpisodeNumber(Integer episodeNumber) { this.episodeNumber = episodeNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getMediaAssetId() { return mediaAssetId; }
    public void setMediaAssetId(String mediaAssetId) { this.mediaAssetId = mediaAssetId; }

    public Instant getCreatedAt() { return createdAt; }
}
