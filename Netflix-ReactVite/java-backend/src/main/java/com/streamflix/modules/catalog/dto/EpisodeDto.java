package com.streamflix.modules.catalog.dto;

import com.streamflix.modules.catalog.domain.Episode;

public class EpisodeDto {
    private String id;
    private Integer episodeNumber;
    private String title;
    private String overview;
    private Integer durationSeconds;
    private String thumbnailUrl;
    private String mediaAssetId;

    public EpisodeDto() {}

    public EpisodeDto(Episode episode) {
        this.id = episode.getId();
        this.episodeNumber = episode.getEpisodeNumber();
        this.title = episode.getTitle();
        this.overview = episode.getOverview();
        this.durationSeconds = episode.getDurationSeconds();
        this.thumbnailUrl = episode.getThumbnailUrl();
        this.mediaAssetId = episode.getMediaAssetId();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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
}
