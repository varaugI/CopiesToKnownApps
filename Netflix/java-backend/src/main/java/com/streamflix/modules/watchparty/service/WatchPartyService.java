package com.streamflix.modules.watchparty.service;

import com.streamflix.common.exception.ResourceNotFoundException;
import com.streamflix.modules.watchparty.domain.WatchPartyRoom;
import com.streamflix.modules.watchparty.dto.ChatMessagePayload;
import com.streamflix.modules.watchparty.dto.PlaybackSyncPayload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class WatchPartyService {

    private final Map<String, WatchPartyRoom> activeRooms = new ConcurrentHashMap<>();
    private final SimpMessagingTemplate messagingTemplate;

    public WatchPartyService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public WatchPartyRoom createRoom(String hostProfileId, String hostName, String titleId) {
        String roomId = UUID.randomUUID().toString().substring(0, 8);
        WatchPartyRoom room = new WatchPartyRoom(roomId, hostProfileId, hostName, titleId);
        activeRooms.put(roomId, room);
        return room;
    }

    public WatchPartyRoom getRoom(String roomId) {
        WatchPartyRoom room = activeRooms.get(roomId);
        if (room == null) {
            throw new ResourceNotFoundException("Watch party room not found with ID: " + roomId);
        }
        return room;
    }

    public WatchPartyRoom joinRoom(String roomId, String profileId, String participantName) {
        WatchPartyRoom room = getRoom(roomId);
        room.getParticipants().put(profileId, participantName != null ? participantName : "User " + profileId);

        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend("/topic/watchparty/" + roomId + "/participants", room.getParticipants());
        }
        return room;
    }

    public WatchPartyRoom leaveRoom(String roomId, String profileId) {
        WatchPartyRoom room = getRoom(roomId);
        room.getParticipants().remove(profileId);

        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend("/topic/watchparty/" + roomId + "/participants", room.getParticipants());
        }
        return room;
    }

    public PlaybackSyncPayload handlePlaybackSync(String roomId, PlaybackSyncPayload payload) {
        WatchPartyRoom room = getRoom(roomId);
        room.setPlaybackPosition(payload.position());
        room.setPlaying(payload.isPlaying());

        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend("/topic/watchparty/" + roomId + "/sync", payload);
        }
        return payload;
    }

    public ChatMessagePayload handleChatMessage(String roomId, ChatMessagePayload payload) {
        ChatMessagePayload enriched = new ChatMessagePayload(
                payload.senderProfileId(),
                payload.senderName(),
                payload.message(),
                Instant.now()
        );

        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend("/topic/watchparty/" + roomId + "/chat", enriched);
        }
        return enriched;
    }
}
