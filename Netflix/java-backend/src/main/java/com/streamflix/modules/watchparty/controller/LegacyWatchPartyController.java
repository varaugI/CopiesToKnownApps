package com.streamflix.modules.watchparty.controller;

import com.streamflix.modules.watchparty.domain.WatchPartyRoom;
import com.streamflix.modules.watchparty.service.WatchPartyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/watch-parties")
public class LegacyWatchPartyController {

    private final WatchPartyService watchPartyService;

    public LegacyWatchPartyController(WatchPartyService watchPartyService) {
        this.watchPartyService = watchPartyService;
    }

    @PostMapping
    public ResponseEntity<WatchPartyRoom> createParty(@RequestBody Map<String, String> body) {
        String hostProfileId = body.getOrDefault("hostProfileId", "profile-1");
        String hostName = body.getOrDefault("hostName", "Host User");
        String titleId = body.getOrDefault("titleId", "movie-1");

        WatchPartyRoom room = watchPartyService.createRoom(hostProfileId, hostName, titleId);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<WatchPartyRoom> getParty(@PathVariable String roomId) {
        return ResponseEntity.ok(watchPartyService.getRoom(roomId));
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<WatchPartyRoom> joinParty(
            @PathVariable String roomId,
            @RequestBody Map<String, String> body
    ) {
        String profileId = body.getOrDefault("profileId", "user-guest");
        String participantName = body.getOrDefault("participantName", "Guest");

        WatchPartyRoom room = watchPartyService.joinRoom(roomId, profileId, participantName);
        return ResponseEntity.ok(room);
    }
}
