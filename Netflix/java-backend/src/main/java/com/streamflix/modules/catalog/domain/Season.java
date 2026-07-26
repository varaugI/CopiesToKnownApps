package com.streamflix.modules.catalog.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "seasons")
public class Season {

    @Id
    private String id;

    @Column(name = "title_id", nullable = false)
    private String titleId;

    @Column(name = "season_number", nullable = false)
    private Integer seasonNumber;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "seasonId", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Episode> episodes = new ArrayList<>();

    public Season() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
    }

    public Season(String titleId, Integer seasonNumber, String name) {
        this();
        this.titleId = titleId;
        this.seasonNumber = seasonNumber;
        this.name = name;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitleId() { return titleId; }
    public void setTitleId(String titleId) { this.titleId = titleId; }

    public Integer getSeasonNumber() { return seasonNumber; }
    public void setSeasonNumber(Integer seasonNumber) { this.seasonNumber = seasonNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Instant getCreatedAt() { return createdAt; }

    public List<Episode> getEpisodes() { return episodes; }
    public void setEpisodes(List<Episode> episodes) { this.episodes = episodes; }
}
