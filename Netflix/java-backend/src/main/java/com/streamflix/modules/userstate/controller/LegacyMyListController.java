package com.streamflix.modules.userstate.controller;

import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.userstate.dto.ToggleMyListResponse;
import com.streamflix.modules.userstate.service.MyListService;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mylist")
public class LegacyMyListController {

    private final MyListService myListService;

    public LegacyMyListController(MyListService myListService) {
        this.myListService = myListService;
    }

    @GetMapping("/{profileId}")
    public ResponseEntity<List<TitleDto>> getMyList(
            @AuthenticationPrincipal String accountId,
            @PathVariable String profileId
    ) {
        String actId = accountId != null ? accountId : "fallback";
        try {
            List<TitleDto> list = myListService.getMyListTitles(actId, profileId, PageRequest.of(0, 100)).getContent();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @PostMapping("/{profileId}/toggle")
    public ResponseEntity<Map<String, Object>> toggleMyList(
            @AuthenticationPrincipal String accountId,
            @PathVariable String profileId,
            @RequestBody Map<String, String> body
    ) {
        String titleId = body.get("titleId");
        if (titleId == null || titleId.isBlank()) {
            titleId = body.get("movieId");
        }

        String actId = accountId != null ? accountId : "fallback";
        try {
            ToggleMyListResponse res = myListService.toggleTitle(actId, profileId, titleId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "inMyList", res.isInMyList(),
                    "profileId", profileId,
                    "movieId", titleId
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }
}
