package com.streamflix.model;

import java.util.List;

public class Movie {
    private String id;
    private String title;
    private String type;
    private String seasons;
    private int matchScore;
    private int releaseYear;
    private String ageRating;
    private String resolution;
    private String duration;
    private String overview;
    private String poster;
    private String backdrop;
    private String trailerUrl;
    private String videoUrl;
    private List<String> categories;
    private Integer topRank;
    private List<String> genres;
    private List<String> cast;
    private String director;

    public Movie() {}

    public Movie(String id, String title, String type, String seasons, int matchScore, int releaseYear,
                 String ageRating, String resolution, String duration, String overview, String poster,
                 String backdrop, String trailerUrl, String videoUrl, List<String> categories,
                 Integer topRank, List<String> genres, List<String> cast, String director) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.seasons = seasons;
        this.matchScore = matchScore;
        this.releaseYear = releaseYear;
        this.ageRating = ageRating;
        this.resolution = resolution;
        this.duration = duration;
        this.overview = overview;
        this.poster = poster;
        this.backdrop = backdrop;
        this.trailerUrl = trailerUrl;
        this.videoUrl = videoUrl;
        this.categories = categories;
        this.topRank = topRank;
        this.genres = genres;
        this.cast = cast;
        this.director = director;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSeasons() { return seasons; }
    public void setSeasons(String seasons) { this.seasons = seasons; }

    public int getMatchScore() { return matchScore; }
    public void setMatchScore(int matchScore) { this.matchScore = matchScore; }

    public int getReleaseYear() { return releaseYear; }
    public void setReleaseYear(int releaseYear) { this.releaseYear = releaseYear; }

    public String getAgeRating() { return ageRating; }
    public void setAgeRating(String ageRating) { this.ageRating = ageRating; }

    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }

    public String getPoster() { return poster; }
    public void setPoster(String poster) { this.poster = poster; }

    public String getBackdrop() { return backdrop; }
    public void setBackdrop(String backdrop) { this.backdrop = backdrop; }

    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public List<String> getCategories() { return categories; }
    public void setCategories(List<String> categories) { this.categories = categories; }

    public Integer getTopRank() { return topRank; }
    public void setTopRank(Integer topRank) { this.topRank = topRank; }

    public List<String> getGenres() { return genres; }
    public void setGenres(List<String> genres) { this.genres = genres; }

    public List<String> getCast() { return cast; }
    public void setCast(List<String> cast) { this.cast = cast; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }
}
