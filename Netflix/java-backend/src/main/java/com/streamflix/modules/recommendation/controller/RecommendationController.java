package com.streamflix.modules.recommendation.controller;

import com.streamflix.common.dto.ApiResponse;
import com.streamflix.common.filter.RequestIdFilter;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.recommendation.service.RecommendationService;
import org.slf4j.MDC;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/profile/{profileId}")
    public ResponseEntity<ApiResponse<Page<TitleDto>>> getRecommendations(
            @AuthenticationPrincipal String accountId,
            @PathVariable String profileId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        Pageable pageable = PageRequest.of(page, size);
        Page<TitleDto> recommendations = recommendationService.getRecommendationsForProfile(accountId, profileId, pageable);
        return ResponseEntity.ok(ApiResponse.of(recommendations, requestId));
    }

    @GetMapping("/similar/{titleId}")
    public ResponseEntity<ApiResponse<List<TitleDto>>> getSimilar(
            @PathVariable String titleId,
            @RequestParam(defaultValue = "6") int limit
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        List<TitleDto> similar = recommendationService.getSimilarTitles(titleId, limit);
        return ResponseEntity.ok(ApiResponse.of(similar, requestId));
    }
}
