package com.streamflix.modules.watchparty.dto;

import java.time.Instant;

public record ChatMessagePayload(
        String senderProfileId,
        String senderName,
        String message,
        Instant timestamp
) {}
