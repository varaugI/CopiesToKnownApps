package com.streamflix.modules.watchparty.domain;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class WatchPartyRoom {

    private String roomId;
    private String hostProfileId;
    private String hostName;
    private String titleId;
    private double playbackPosition = 0.0;
    private boolean isPlaying = false;
    private Instant createdAt = Instant.now();

    private Map<String, String> participants = new ConcurrentHashMap<>();

    public WatchPartyRoom() {
    }

    public WatchPartyRoom(String roomId, String hostProfileId, String hostName, String titleId) {
        this.roomId = roomId;
        this.hostProfileId = hostProfileId;
        this.hostName = hostName;
        this.titleId = titleId;
        if (hostProfileId != null && hostName != null) {
            this.participants.put(hostProfileId, hostName);
        }
    }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }

    public String getHostProfileId() { return hostProfileId; }
    public void setHostProfileId(String hostProfileId) { this.hostProfileId = hostProfileId; }

    public String getHostName() { return hostName; }
    public void setHostName(String hostName) { this.hostName = hostName; }

    public String getTitleId() { return titleId; }
    public void setTitleId(String titleId) { this.titleId = titleId; }

    public double getPlaybackPosition() { return playbackPosition; }
    public void setPlaybackPosition(double playbackPosition) { this.playbackPosition = playbackPosition; }

    public boolean isPlaying() { return isPlaying; }
    public void setPlaying(boolean playing) { isPlaying = playing; }

    public Instant getCreatedAt() { return createdAt; }

    public Map<String, String> getParticipants() { return participants; }
    public void setParticipants(Map<String, String> participants) { this.participants = participants; }
}
