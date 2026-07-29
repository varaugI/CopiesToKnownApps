package com.netflixcopy.catalog;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.Map;

import static com.netflixcopy.catalog.CatalogModels.CatalogResponse;

@RestController
@RequestMapping("/api")
class CatalogController {

    private final CatalogService catalogService;

    CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/catalog")
    ResponseEntity<CatalogResponse> catalog() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(5)).cachePublic())
                .body(catalogService.getCatalog());
    }

    @GetMapping("/health")
    Map<String, String> health() {
        return Map.of("status", "UP", "service", "catalog-api");
    }
}
