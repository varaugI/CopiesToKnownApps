package com.streamflix.model;

public class Profile {
    private String id;
    private String name;
    private String avatar;
    private String color;
    private boolean isKids;

    public Profile() {}

    public Profile(String id, String name, String avatar, String color, boolean isKids) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.color = color;
        this.isKids = isKids;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public boolean isKids() { return isKids; }
    public void setKids(boolean kids) { isKids = kids; }
}
