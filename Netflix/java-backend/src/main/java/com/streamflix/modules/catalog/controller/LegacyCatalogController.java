package com.streamflix.modules.catalog.controller;

import com.streamflix.modules.catalog.dto.GenreDto;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.catalog.service.CatalogService;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LegacyCatalogController {

    private final CatalogService catalogService;

    public LegacyCatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/movies")
    public ResponseEntity<List<TitleDto>> getMovies(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String type
    ) {
        List<TitleDto> titles = catalogService.getTitles(type, genre, null, PageRequest.of(0, 100)).getContent();
        return ResponseEntity.ok(titles);
    }

    @GetMapping("/billboard")
    public ResponseEntity<TitleDto> getBillboard() {
        return ResponseEntity.ok(catalogService.getBillboardTitle());
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> names = catalogService.getGenres().stream().map(GenreDto::getName).toList();
        return ResponseEntity.ok(names);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TitleDto>> searchMovies(@RequestParam String q) {
        List<TitleDto> titles = catalogService.getTitles(null, null, q, PageRequest.of(0, 50)).getContent();
        return ResponseEntity.ok(titles);
    }
}
