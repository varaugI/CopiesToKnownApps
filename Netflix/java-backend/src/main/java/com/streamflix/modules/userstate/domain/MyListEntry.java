package com.streamflix.modules.userstate.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "my_list_entries", uniqueConstraints = {
    @UniqueConstraint(name = "uk_profile_title_mylist", columnNames = {"profile_id", "title_id"})
})
public class MyListEntry {

    @Id
    private String id;

    @Column(name = "profile_id", nullable = false)
    private String profileId;

    @Column(name = "title_id", nullable = false)
    private String titleId;

    @Column(name = "added_at", nullable = false, updatable = false)
    private Instant addedAt;

    public MyListEntry() {
        this.id = UUID.randomUUID().toString();
        this.addedAt = Instant.now();
    }

    public MyListEntry(String profileId, String titleId) {
        this();
        this.profileId = profileId;
        this.titleId = titleId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProfileId() { return profileId; }
    public void setProfileId(String profileId) { this.profileId = profileId; }

    public String getTitleId() { return titleId; }
    public void setTitleId(String titleId) { this.titleId = titleId; }

    public Instant getAddedAt() { return addedAt; }
}
