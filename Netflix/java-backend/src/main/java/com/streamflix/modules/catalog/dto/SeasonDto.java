package com.streamflix.modules.catalog.dto;

import com.streamflix.modules.catalog.domain.Season;

import java.util.ArrayList;
import java.util.List;

public class SeasonDto {
    private String id;
    private Integer seasonNumber;
    private String name;
    private List<EpisodeDto> episodes = new ArrayList<>();

    public SeasonDto() {}

    public SeasonDto(Season season) {
        this.id = season.getId();
        this.seasonNumber = season.getSeasonNumber();
        this.name = season.getName();
        if (season.getEpisodes() != null) {
            this.episodes = season.getEpisodes().stream().map(EpisodeDto::new).toList();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Integer getSeasonNumber() { return seasonNumber; }
    public void setSeasonNumber(Integer seasonNumber) { this.seasonNumber = seasonNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<EpisodeDto> getEpisodes() { return episodes; }
    public void setEpisodes(List<EpisodeDto> episodes) { this.episodes = episodes; }
}
