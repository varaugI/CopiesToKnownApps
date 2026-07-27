package com.streamflix.modules.watchparty.dto;

public record PlaybackSyncPayload(
        String senderProfileId,
        String senderName,
        double position,
        boolean isPlaying,
        String action
) {}
