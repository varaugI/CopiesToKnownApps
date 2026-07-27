package com.streamflix.modules.watchparty.controller;

import com.streamflix.modules.watchparty.dto.ChatMessagePayload;
import com.streamflix.modules.watchparty.dto.PlaybackSyncPayload;
import com.streamflix.modules.watchparty.service.WatchPartyService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class WatchPartyWebSocketController {

    private final WatchPartyService watchPartyService;

    public WatchPartyWebSocketController(WatchPartyService watchPartyService) {
        this.watchPartyService = watchPartyService;
    }

    @MessageMapping("/watchparty/{roomId}/sync")
    public void syncPlayback(
            @DestinationVariable String roomId,
            PlaybackSyncPayload payload
    ) {
        watchPartyService.handlePlaybackSync(roomId, payload);
    }

    @MessageMapping("/watchparty/{roomId}/chat")
    public void chatMessage(
            @DestinationVariable String roomId,
            ChatMessagePayload payload
    ) {
        watchPartyService.handleChatMessage(roomId, payload);
    }
}
