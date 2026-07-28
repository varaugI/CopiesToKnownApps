package com.youtube.dto;

import jakarta.validation.constraints.NotBlank;

public class CommentCreateRequest {

    @NotBlank(message = "Comment text cannot be empty")
    private String text;

    private String userName;
    private String userAvatar;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserAvatar() { return userAvatar; }
    public void setUserAvatar(String userAvatar) { this.userAvatar = userAvatar; }
}
