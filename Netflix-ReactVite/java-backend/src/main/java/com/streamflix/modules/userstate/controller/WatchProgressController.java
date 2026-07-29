package com.streamflix.modules.userstate.controller;

import com.streamflix.common.dto.ApiResponse;
import com.streamflix.common.filter.RequestIdFilter;
import com.streamflix.modules.userstate.dto.UpdateProgressRequest;
import com.streamflix.modules.userstate.dto.WatchProgressDto;
import com.streamflix.modules.userstate.service.WatchProgressService;
import jakarta.validation.Valid;
import org.slf4j.MDC;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles/{profileId}/progress")
public class WatchProgressController {

    private final WatchProgressService watchProgressService;

    public WatchProgressController(WatchProgressService watchProgressService) {
        this.watchProgressService = watchProgressService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WatchProgressDto>> updateProgress(
            @AuthenticationPrincipal String accountId,
            @PathVariable String profileId,
            @Valid @RequestBody UpdateProgressRequest request
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        WatchProgressDto result = watchProgressService.updateProgress(accountId, profileId, request);
        return ResponseEntity.ok(ApiResponse.of(result, requestId));
    }

    @GetMapping("/{titleId}")
    public ResponseEntity<ApiResponse<WatchProgressDto>> getProgress(
            @AuthenticationPrincipal String accountId,
            @PathVariable String profileId,
            @PathVariable String titleId
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        WatchProgressDto result = watchProgressService.getProgress(accountId, profileId, titleId).orElse(null);
        return ResponseEntity.ok(ApiResponse.of(result, requestId));
    }

    @GetMapping("/continue-watching")
    public ResponseEntity<ApiResponse<Page<WatchProgressDto>>> getContinueWatching(
            @AuthenticationPrincipal String accountId,
            @PathVariable String profileId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        Pageable pageable = PageRequest.of(page, size);
        Page<WatchProgressDto> result = watchProgressService.getContinueWatching(accountId, profileId, pageable);
        return ResponseEntity.ok(ApiResponse.of(result, requestId));
    }
}
