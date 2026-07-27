package com.streamflix.modules.watchparty.controller;

import com.streamflix.common.dto.ApiResponse;
import com.streamflix.common.filter.RequestIdFilter;
import com.streamflix.modules.watchparty.domain.WatchPartyRoom;
import com.streamflix.modules.watchparty.dto.CreateWatchPartyRequest;
import com.streamflix.modules.watchparty.dto.JoinWatchPartyRequest;
import com.streamflix.modules.watchparty.service.WatchPartyService;
import jakarta.validation.Valid;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/watchparties")
public class WatchPartyController {

    private final WatchPartyService watchPartyService;

    public WatchPartyController(WatchPartyService watchPartyService) {
        this.watchPartyService = watchPartyService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WatchPartyRoom>> createRoom(
            @Valid @RequestBody CreateWatchPartyRequest request
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        WatchPartyRoom room = watchPartyService.createRoom(
                request.hostProfileId(),
                request.hostName(),
                request.titleId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(room, requestId));
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<ApiResponse<WatchPartyRoom>> getRoom(
            @PathVariable String roomId
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        WatchPartyRoom room = watchPartyService.getRoom(roomId);
        return ResponseEntity.ok(ApiResponse.of(room, requestId));
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<ApiResponse<WatchPartyRoom>> joinRoom(
            @PathVariable String roomId,
            @Valid @RequestBody JoinWatchPartyRequest request
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        WatchPartyRoom room = watchPartyService.joinRoom(
                roomId,
                request.profileId(),
                request.participantName()
        );
        return ResponseEntity.ok(ApiResponse.of(room, requestId));
    }

    @PostMapping("/{roomId}/leave")
    public ResponseEntity<ApiResponse<WatchPartyRoom>> leaveRoom(
            @PathVariable String roomId,
            @RequestParam String profileId
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        WatchPartyRoom room = watchPartyService.leaveRoom(roomId, profileId);
        return ResponseEntity.ok(ApiResponse.of(room, requestId));
    }
}
