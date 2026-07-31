package com.prime.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "cast_members")
public class CastMember {

    @Id
    private String id;

    private String mediaId;
    private String actorName;
    private String roleName;

    public CastMember() {}

    public CastMember(String id, String mediaId, String actorName, String roleName) {
        this.id = id;
        this.mediaId = mediaId;
        this.actorName = actorName;
        this.roleName = roleName;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMediaId() { return mediaId; }
    public void setMediaId(String mediaId) { this.mediaId = mediaId; }

    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }
}
