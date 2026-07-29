package com.streamflix.modules.catalog.controller;

import com.streamflix.common.dto.ApiResponse;
import com.streamflix.common.filter.RequestIdFilter;
import com.streamflix.modules.catalog.dto.GenreDto;
import com.streamflix.modules.catalog.dto.TitleDetailDto;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.catalog.service.CatalogService;
import org.slf4j.MDC;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalog")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/titles")
    public ResponseEntity<ApiResponse<Page<TitleDto>>> getTitles(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TitleDto> result = catalogService.getTitles(type, genre, query, pageable);
        return ResponseEntity.ok(ApiResponse.of(result, requestId));
    }

    @GetMapping("/titles/{id}")
    public ResponseEntity<ApiResponse<TitleDetailDto>> getTitleById(@PathVariable String id) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        TitleDetailDto title = catalogService.getTitleById(id);
        return ResponseEntity.ok(ApiResponse.of(title, requestId));
    }

    @GetMapping("/billboard")
    public ResponseEntity<ApiResponse<TitleDto>> getBillboard() {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        TitleDto billboard = catalogService.getBillboardTitle();
        return ResponseEntity.ok(ApiResponse.of(billboard, requestId));
    }

    @GetMapping("/genres")
    public ResponseEntity<ApiResponse<List<GenreDto>>> getGenres() {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        List<GenreDto> genres = catalogService.getGenres();
        return ResponseEntity.ok(ApiResponse.of(genres, requestId));
    }
}
