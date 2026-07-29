package com.streamflix.modules.userstate.dto;

import com.streamflix.modules.userstate.domain.WatchProgress;
import java.time.Instant;

public class WatchProgressDto {
    private String id;
    private String profileId;
    private String titleId;
    private String episodeId;
    private Integer progressSeconds;
    private Integer durationSeconds;
    private boolean completed;
    private Instant lastWatchedAt;

    public WatchProgressDto() {}

    public WatchProgressDto(WatchProgress wp) {
        this.id = wp.getId();
        this.profileId = wp.getProfileId();
        this.titleId = wp.getTitleId();
        this.episodeId = wp.getEpisodeId();
        this.progressSeconds = wp.getProgressSeconds();
        this.durationSeconds = wp.getDurationSeconds();
        this.completed = wp.isCompleted();
        this.lastWatchedAt = wp.getLastWatchedAt();
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
