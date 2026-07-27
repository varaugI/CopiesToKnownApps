package com.streamflix.common.event;

import java.time.Instant;

public record MediaUploadEvent(
        String titleId,
        String mediaAssetId,
        Instant timestamp
) {}
