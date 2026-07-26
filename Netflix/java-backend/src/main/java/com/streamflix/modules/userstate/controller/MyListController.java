package com.streamflix.modules.userstate.controller;

import com.streamflix.common.dto.ApiResponse;
import com.streamflix.common.filter.RequestIdFilter;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.userstate.dto.ToggleMyListResponse;
import com.streamflix.modules.userstate.service.MyListService;
import org.slf4j.MDC;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/profiles/{profileId}/mylist")
public class MyListController {

    private final MyListService myListService;

    public MyListController(MyListService myListService) {
        this.myListService = myListService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TitleDto>>> getMyList(
            @AuthenticationPrincipal String accountId,
            @PathVariable String profileId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        Pageable pageable = PageRequest.of(page, size);
        Page<TitleDto> list = myListService.getMyListTitles(accountId, profileId, pageable);
        return ResponseEntity.ok(ApiResponse.of(list, requestId));
    }

    @PostMapping("/{titleId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> addTitle(
            @AuthenticationPrincipal String accountId,
            @PathVariable String profileId,
            @PathVariable String titleId
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        myListService.addTitle(accountId, profileId, titleId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(Map.of("message", "Title added to My List"), requestId));
    }

    @DeleteMapping("/{titleId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> removeTitle(
            @AuthenticationPrincipal String accountId,
            @PathVariable String profileId,
            @PathVariable String titleId
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        myListService.removeTitle(accountId, profileId, titleId);
        return ResponseEntity.ok(ApiResponse.of(Map.of("message", "Title removed from My List"), requestId));
    }

    @PostMapping("/toggle")
    public ResponseEntity<ApiResponse<ToggleMyListResponse>> toggleTitle(
            @AuthenticationPrincipal String accountId,
            @PathVariable String profileId,
            @RequestBody Map<String, String> body
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        String titleId = body.get("titleId");
        if (titleId == null || titleId.isBlank()) {
            titleId = body.get("movieId");
        }

        ToggleMyListResponse response = myListService.toggleTitle(accountId, profileId, titleId);
        return ResponseEntity.ok(ApiResponse.of(response, requestId));
    }
}
