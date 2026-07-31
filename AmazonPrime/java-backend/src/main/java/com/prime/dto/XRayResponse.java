package com.prime.dto;

import com.prime.domain.CastMember;
import com.prime.domain.MediaContent;
import com.prime.domain.SoundtrackTrack;

import java.util.List;

public class XRayResponse {

    private MediaContent media;
    private List<CastMember> cast;
    private List<SoundtrackTrack> soundtrack;

    public XRayResponse(MediaContent media, List<CastMember> cast, List<SoundtrackTrack> soundtrack) {
        this.media = media;
        this.cast = cast;
        this.soundtrack = soundtrack;
    }

    public MediaContent getMedia() { return media; }
    public void setMedia(MediaContent media) { this.media = media; }

    public List<CastMember> getCast() { return cast; }
    public void setCast(List<CastMember> cast) { this.cast = cast; }

    public List<SoundtrackTrack> getSoundtrack() { return soundtrack; }
    public void setSoundtrack(List<SoundtrackTrack> soundtrack) { this.soundtrack = soundtrack; }
}
