package com.streamflix.modules.userstate.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UpdateProgressRequest {

    @NotBlank(message = "Title ID is required")
    private String titleId;

    private String episodeId;

    @NotNull(message = "Progress seconds is required")
    @Min(0)
    private Integer progressSeconds;

    @NotNull(message = "Duration seconds is required")
    @Min(1)
    private Integer durationSeconds;

    public UpdateProgressRequest() {}

    public UpdateProgressRequest(String titleId, String episodeId, Integer progressSeconds, Integer durationSeconds) {
        this.titleId = titleId;
        this.episodeId = episodeId;
        this.progressSeconds = progressSeconds;
        this.durationSeconds = durationSeconds;
    }

    public String getTitleId() { return titleId; }
    public void setTitleId(String titleId) { this.titleId = titleId; }

    public String getEpisodeId() { return episodeId; }
    public void setEpisodeId(String episodeId) { this.episodeId = episodeId; }

    public Integer getProgressSeconds() { return progressSeconds; }
    public void setProgressSeconds(Integer progressSeconds) { this.progressSeconds = progressSeconds; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
}
