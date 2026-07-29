package com.streamflix.modules.watchparty.service;

import com.streamflix.modules.watchparty.domain.WatchPartyRoom;
import com.streamflix.modules.watchparty.dto.ChatMessagePayload;
import com.streamflix.modules.watchparty.dto.PlaybackSyncPayload;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class WatchPartyServiceTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    private WatchPartyService watchPartyService;

    @BeforeEach
    void setUp() {
        watchPartyService = new WatchPartyService(messagingTemplate);
    }

    @Test
    void createRoom_ReturnsNewRoomWithHostParticipant() {
        WatchPartyRoom room = watchPartyService.createRoom("host-1", "Alice", "title-99");

        assertThat(room.getRoomId()).isNotNull().hasSize(8);
        assertThat(room.getHostProfileId()).isEqualTo("host-1");
        assertThat(room.getTitleId()).isEqualTo("title-99");
        assertThat(room.getParticipants()).containsEntry("host-1", "Alice");
    }

    @Test
    void joinAndLeaveRoom_UpdatesParticipantsMap() {
        WatchPartyRoom room = watchPartyService.createRoom("host-1", "Alice", "title-99");
        watchPartyService.joinRoom(room.getRoomId(), "user-2", "Bob");

        assertThat(room.getParticipants()).hasSize(2);
        assertThat(room.getParticipants()).containsEntry("user-2", "Bob");

        watchPartyService.leaveRoom(room.getRoomId(), "user-2");
        assertThat(room.getParticipants()).hasSize(1);
        assertThat(room.getParticipants()).doesNotContainKey("user-2");
    }

    @Test
    void handlePlaybackSync_UpdatesRoomPlaybackState() {
        WatchPartyRoom room = watchPartyService.createRoom("host-1", "Alice", "title-99");
        PlaybackSyncPayload payload = new PlaybackSyncPayload("host-1", "Alice", 120.5, true, "PLAY");

        watchPartyService.handlePlaybackSync(room.getRoomId(), payload);

        assertThat(room.getPlaybackPosition()).isEqualTo(120.5);
        assertThat(room.isPlaying()).isTrue();
    }

    @Test
    void handleChatMessage_EnrichesAndBroadcastsMessage() {
        WatchPartyRoom room = watchPartyService.createRoom("host-1", "Alice", "title-99");
        ChatMessagePayload input = new ChatMessagePayload("host-1", "Alice", "Hello everyone!", null);

        ChatMessagePayload result = watchPartyService.handleChatMessage(room.getRoomId(), input);

        assertThat(result.message()).isEqualTo("Hello everyone!");
        assertThat(result.timestamp()).isNotNull();
    }
}
