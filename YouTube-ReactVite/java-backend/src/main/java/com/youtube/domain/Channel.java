package com.youtube.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "channels")
public class Channel {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String handle;

    @Column(length = 1000)
    private String avatar;

    @Column(length = 1000)
    private String banner;

    private Long subscribersCount;
    private Boolean isVerified;
    private Boolean isSubscribed;

    public Channel() {}

    public Channel(String id, String name, String handle, String avatar, String banner,
                   Long subscribersCount, Boolean isVerified, Boolean isSubscribed) {
        this.id = id;
        this.name = name;
        this.handle = handle;
        this.avatar = avatar;
        this.banner = banner;
        this.subscribersCount = subscribersCount;
        this.isVerified = isVerified;
        this.isSubscribed = isSubscribed;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getHandle() { return handle; }
    public void setHandle(String handle) { this.handle = handle; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getBanner() { return banner; }
    public void setBanner(String banner) { this.banner = banner; }

    public Long getSubscribersCount() { return subscribersCount; }
    public void setSubscribersCount(Long subscribersCount) { this.subscribersCount = subscribersCount; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public Boolean getIsSubscribed() { return isSubscribed; }
    public void setIsSubscribed(Boolean isSubscribed) { this.isSubscribed = isSubscribed; }
}
