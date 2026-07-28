package com.youtube.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "comments")
public class Comment {

    @Id
    private String id;

    @Column(name = "video_id", nullable = false)
    private String videoId;

    private String userName;

    @Column(length = 1000)
    private String userAvatar;

    @Column(length = 2000, nullable = false)
    private String text;

    private String timestamp;
    private Long likesCount;
    private Boolean isLiked;
    private Boolean isPinned;
    private Boolean hasCreatorHeart;

    public Comment() {}

    public Comment(String id, String videoId, String userName, String userAvatar, String text,
                   String timestamp, Long likesCount, Boolean isLiked, Boolean isPinned, Boolean hasCreatorHeart) {
        this.id = id;
        this.videoId = videoId;
        this.userName = userName;
        this.userAvatar = userAvatar;
        this.text = text;
        this.timestamp = timestamp;
        this.likesCount = likesCount;
        this.isLiked = isLiked;
        this.isPinned = isPinned;
        this.hasCreatorHeart = hasCreatorHeart;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getVideoId() { return videoId; }
    public void setVideoId(String videoId) { this.videoId = videoId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserAvatar() { return userAvatar; }
    public void setUserAvatar(String userAvatar) { this.userAvatar = userAvatar; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public Long getLikesCount() { return likesCount; }
    public void setLikesCount(Long likesCount) { this.likesCount = likesCount; }

    public Boolean getIsLiked() { return isLiked; }
    public void setIsLiked(Boolean isLiked) { this.isLiked = isLiked; }

    public Boolean getIsPinned() { return isPinned; }
    public void setIsPinned(Boolean isPinned) { this.isPinned = isPinned; }

    public Boolean getHasCreatorHeart() { return hasCreatorHeart; }
    public void setHasCreatorHeart(Boolean hasCreatorHeart) { this.hasCreatorHeart = hasCreatorHeart; }
}
