package com.streamflix.modules.search.controller;

import com.streamflix.common.dto.ApiResponse;
import com.streamflix.common.filter.RequestIdFilter;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.search.service.SearchService;
import org.slf4j.MDC;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalog/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TitleDto>>> search(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        Pageable pageable = PageRequest.of(page, size);
        Page<TitleDto> results = searchService.searchCatalog(q, pageable);
        return ResponseEntity.ok(ApiResponse.of(results, requestId));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<String>>> getSuggestions(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "5") int limit
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        List<String> suggestions = searchService.getSearchSuggestions(q, limit);
        return ResponseEntity.ok(ApiResponse.of(suggestions, requestId));
    }
}
