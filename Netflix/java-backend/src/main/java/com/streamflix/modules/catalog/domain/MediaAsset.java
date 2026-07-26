package com.streamflix.modules.catalog.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "media_assets")
public class MediaAsset {

    @Id
    private String id;

    @Column(name = "title_id", nullable = false)
    private String titleId;

    @Column(name = "object_key", nullable = false, length = 500)
    private String objectKey;

    @Column(nullable = false, length = 50)
    private String status = "CREATED";

    @Column(name = "hls_master_url", length = 500)
    private String hlsMasterUrl;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public MediaAsset() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public MediaAsset(String titleId, String objectKey, String status, String hlsMasterUrl, Integer durationSeconds) {
        this();
        this.titleId = titleId;
        this.objectKey = objectKey;
        if (status != null) this.status = status;
        this.hlsMasterUrl = hlsMasterUrl;
        this.durationSeconds = durationSeconds;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitleId() { return titleId; }
    public void setTitleId(String titleId) { this.titleId = titleId; }

    public String getObjectKey() { return objectKey; }
    public void setObjectKey(String objectKey) { this.objectKey = objectKey; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getHlsMasterUrl() { return hlsMasterUrl; }
    public void setHlsMasterUrl(String hlsMasterUrl) { this.hlsMasterUrl = hlsMasterUrl; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
