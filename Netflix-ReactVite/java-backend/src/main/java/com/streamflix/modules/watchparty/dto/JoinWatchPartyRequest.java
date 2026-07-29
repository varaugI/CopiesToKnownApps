package com.streamflix.modules.watchparty.dto;

import jakarta.validation.constraints.NotBlank;

public record JoinWatchPartyRequest(
        @NotBlank(message = "Profile ID is required")
        String profileId,
        @NotBlank(message = "Participant name is required")
        String participantName
) {}
