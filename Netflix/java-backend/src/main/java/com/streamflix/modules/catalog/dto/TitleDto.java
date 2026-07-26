package com.streamflix.modules.catalog.dto;

import com.streamflix.modules.catalog.domain.Genre;
import com.streamflix.modules.catalog.domain.Title;

import java.util.ArrayList;
import java.util.List;

public class TitleDto {
    private String id;
    private String title;
    private String type;
    private String overview;
    private Integer releaseYear;
    private String maturityRating;
    private Integer matchScore;
    private String resolution;
    private String duration;
    private String posterUrl;
    private String backdropUrl;
    private String trailerUrl;
    private String director;
    private String castMembers;
    private Integer topRank;
    private List<String> genres = new ArrayList<>();

    public TitleDto() {}

    public TitleDto(Title title) {
        this.id = title.getId();
        this.title = title.getTitle();
        this.type = title.getType();
        this.overview = title.getOverview();
        this.releaseYear = title.getReleaseYear();
        this.maturityRating = title.getMaturityRating();
        this.matchScore = title.getMatchScore();
        this.resolution = title.getResolution();
        this.duration = title.getDuration();
        this.posterUrl = title.getPosterUrl();
        this.backdropUrl = title.getBackdropUrl();
        this.trailerUrl = title.getTrailerUrl();
        this.director = title.getDirector();
        this.castMembers = title.getCastMembers();
        this.topRank = title.getTopRank();
        if (title.getGenres() != null) {
            this.genres = title.getGenres().stream().map(Genre::getName).toList();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }

    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }

    public String getMaturityRating() { return maturityRating; }
    public void setMaturityRating(String maturityRating) { this.maturityRating = maturityRating; }

    public Integer getMatchScore() { return matchScore; }
    public void setMatchScore(Integer matchScore) { this.matchScore = matchScore; }

    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public String getBackdropUrl() { return backdropUrl; }
    public void setBackdropUrl(String backdropUrl) { this.backdropUrl = backdropUrl; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getCastMembers() { return castMembers; }
    public void setCastMembers(String castMembers) { this.castMembers = castMembers; }

    public Integer getTopRank() { return topRank; }
    public void setTopRank(Integer topRank) { this.topRank = topRank; }

    public List<String> getGenres() { return genres; }
    public void setGenres(List<String> genres) { this.genres = genres; }
}
