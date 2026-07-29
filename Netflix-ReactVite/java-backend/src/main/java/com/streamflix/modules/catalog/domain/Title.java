package com.streamflix.modules.catalog.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "titles")
public class Title {

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String overview;

    @Column(name = "release_year", nullable = false)
    private Integer releaseYear;

    @Column(name = "maturity_rating", nullable = false, length = 20)
    private String maturityRating;

    @Column(name = "match_score", nullable = false)
    private Integer matchScore = 95;

    @Column(nullable = false, length = 50)
    private String resolution = "4K Ultra HD";

    @Column(length = 50)
    private String duration;

    @Column(name = "poster_url", length = 500)
    private String posterUrl;

    @Column(name = "backdrop_url", length = 500)
    private String backdropUrl;

    @Column(name = "trailer_url", length = 500)
    private String trailerUrl;

    private String director;

    @Column(name = "cast_members", columnDefinition = "TEXT")
    private String castMembers;

    @Column(name = "top_rank")
    private Integer topRank;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "title_genres",
            joinColumns = @JoinColumn(name = "title_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private List<Genre> genres = new ArrayList<>();

    @OneToMany(mappedBy = "titleId", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Season> seasons = new ArrayList<>();

    public Title() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public Title(String title, String type, String overview, Integer releaseYear, String maturityRating, Integer matchScore, String resolution, String duration, String posterUrl, String backdropUrl, String trailerUrl, String director, String castMembers, Integer topRank) {
        this();
        this.title = title;
        this.type = type;
        this.overview = overview;
        this.releaseYear = releaseYear;
        this.maturityRating = maturityRating;
        if (matchScore != null) this.matchScore = matchScore;
        if (resolution != null) this.resolution = resolution;
        this.duration = duration;
        this.posterUrl = posterUrl;
        this.backdropUrl = backdropUrl;
        this.trailerUrl = trailerUrl;
        this.director = director;
        this.castMembers = castMembers;
        this.topRank = topRank;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
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

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public List<Genre> getGenres() { return genres; }
    public void setGenres(List<Genre> genres) { this.genres = genres; }

    public List<Season> getSeasons() { return seasons; }
    public void setSeasons(List<Season> seasons) { this.seasons = seasons; }
}
