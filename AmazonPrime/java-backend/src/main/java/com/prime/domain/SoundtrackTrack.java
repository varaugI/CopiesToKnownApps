package com.prime.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "soundtrack_tracks")
public class SoundtrackTrack {

    @Id
    private String id;

    private String mediaId;
    private String trackTitle;
    private String artistName;

    public SoundtrackTrack() {}

    public SoundtrackTrack(String id, String mediaId, String trackTitle, String artistName) {
        this.id = id;
        this.mediaId = mediaId;
        this.trackTitle = trackTitle;
        this.artistName = artistName;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMediaId() { return mediaId; }
    public void setMediaId(String mediaId) { this.mediaId = mediaId; }

    public String getTrackTitle() { return trackTitle; }
    public void setTrackTitle(String trackTitle) { this.trackTitle = trackTitle; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }
}
