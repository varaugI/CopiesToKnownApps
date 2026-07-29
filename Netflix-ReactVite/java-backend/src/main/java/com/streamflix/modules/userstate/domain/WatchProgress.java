package com.streamflix.modules.userstate.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "watch_progress", uniqueConstraints = {
    @UniqueConstraint(name = "uk_profile_title_progress", columnNames = {"profile_id", "title_id"})
})
public class WatchProgress {

    @Id
    private String id;

    @Column(name = "profile_id", nullable = false)
    private String profileId;

    @Column(name = "title_id", nullable = false)
    private String titleId;

    @Column(name = "episode_id")
    private String episodeId;

    @Column(name = "progress_seconds", nullable = false)
    private Integer progressSeconds = 0;

    @Column(name = "duration_seconds", nullable = false)
    private Integer durationSeconds = 0;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(name = "last_watched_at", nullable = false)
    private Instant lastWatchedAt;

    public WatchProgress() {
        this.id = UUID.randomUUID().toString();
        this.lastWatchedAt = Instant.now();
    }

    public WatchProgress(String profileId, String titleId, String episodeId, Integer progressSeconds, Integer durationSeconds, boolean completed) {
        this();
        this.profileId = profileId;
        this.titleId = titleId;
        this.episodeId = episodeId;
        this.progressSeconds = progressSeconds != null ? progressSeconds : 0;
        this.durationSeconds = durationSeconds != null ? durationSeconds : 0;
        this.completed = completed;
    }

    @PreUpdate
    public void onUpdate() {
        this.lastWatchedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProfileId() { return profileId; }
    public void setProfileId(String profileId) { this.profileId = profileId; }

    public String getTitleId() { return titleId; }
    public void setTitleId(String titleId) { this.titleId = titleId; }

    public String getEpisodeId() { return episodeId; }
    public void setEpisodeId(String episodeId) { this.episodeId = episodeId; }

    public Integer getProgressSeconds() { return progressSeconds; }
    public void setProgressSeconds(Integer progressSeconds) { this.progressSeconds = progressSeconds; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public Instant getLastWatchedAt() { return lastWatchedAt; }
    public void setLastWatchedAt(Instant lastWatchedAt) { this.lastWatchedAt = lastWatchedAt; }
}
