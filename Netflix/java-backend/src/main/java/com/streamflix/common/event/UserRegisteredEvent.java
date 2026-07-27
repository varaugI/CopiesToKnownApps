package com.streamflix.common.event;

import java.time.Instant;

public record UserRegisteredEvent(
        String accountId,
        String email,
        Instant timestamp
) {}
