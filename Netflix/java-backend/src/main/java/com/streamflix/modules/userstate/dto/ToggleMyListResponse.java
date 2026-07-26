package com.streamflix.modules.userstate.dto;

public class ToggleMyListResponse {
    private String profileId;
    private String titleId;
    private boolean inMyList;

    public ToggleMyListResponse() {}

    public ToggleMyListResponse(String profileId, String titleId, boolean inMyList) {
        this.profileId = profileId;
        this.titleId = titleId;
        this.inMyList = inMyList;
    }

    public String getProfileId() { return profileId; }
    public void setProfileId(String profileId) { this.profileId = profileId; }

    public String getTitleId() { return titleId; }
    public void setTitleId(String titleId) { this.titleId = titleId; }

    public boolean isInMyList() { return inMyList; }
    public void setInMyList(boolean inMyList) { this.inMyList = inMyList; }
}
