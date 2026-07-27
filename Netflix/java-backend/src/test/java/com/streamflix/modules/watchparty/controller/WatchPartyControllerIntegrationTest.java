package com.streamflix.modules.watchparty.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streamflix.modules.watchparty.domain.WatchPartyRoom;
import com.streamflix.modules.watchparty.dto.CreateWatchPartyRequest;
import com.streamflix.modules.watchparty.dto.JoinWatchPartyRequest;
import com.streamflix.modules.watchparty.service.WatchPartyService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WatchPartyControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private WatchPartyService watchPartyService;

    @Test
    void createRoom_Returns201CreatedWithWatchPartyRoom() throws Exception {
        CreateWatchPartyRequest request = new CreateWatchPartyRequest("prof-1", "Alice", "title-1");
        WatchPartyRoom room = new WatchPartyRoom("room1234", "prof-1", "Alice", "title-1");

        given(watchPartyService.createRoom("prof-1", "Alice", "title-1")).willReturn(room);

        mockMvc.perform(post("/api/v1/watchparties")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.roomId").value("room1234"))
                .andExpect(jsonPath("$.data.hostProfileId").value("prof-1"));
    }

    @Test
    void getRoom_Returns200WithWatchPartyRoom() throws Exception {
        WatchPartyRoom room = new WatchPartyRoom("room1234", "prof-1", "Alice", "title-1");

        given(watchPartyService.getRoom("room1234")).willReturn(room);

        mockMvc.perform(get("/api/v1/watchparties/room1234"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.roomId").value("room1234"));
    }

    @Test
    void joinRoom_Returns200WithUpdatedWatchPartyRoom() throws Exception {
        JoinWatchPartyRequest request = new JoinWatchPartyRequest("prof-2", "Bob");
        WatchPartyRoom room = new WatchPartyRoom("room1234", "prof-1", "Alice", "title-1");
        room.getParticipants().put("prof-2", "Bob");

        given(watchPartyService.joinRoom("room1234", "prof-2", "Bob")).willReturn(room);

        mockMvc.perform(post("/api/v1/watchparties/room1234/join")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.participants.prof-2").value("Bob"));
    }
}
