package com.streamflix.common.event;

import java.time.Instant;

public record WatchProgressCompletedEvent(
        String profileId,
        String titleId,
        Instant completedAt
) {}
