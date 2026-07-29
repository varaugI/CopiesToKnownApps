package com.streamflix.modules.watchparty.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateWatchPartyRequest(
        @NotBlank(message = "Host profile ID is required")
        String hostProfileId,
        @NotBlank(message = "Host name is required")
        String hostName,
        @NotBlank(message = "Title ID is required")
        String titleId
) {}
