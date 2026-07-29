package com.streamflix.modules.search.service;

import com.streamflix.modules.catalog.domain.Title;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.catalog.repository.TitleRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SearchService {

    private final TitleRepository titleRepository;

    public SearchService(TitleRepository titleRepository) {
        this.titleRepository = titleRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "search_results", key = "(#query ?: '') + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<TitleDto> searchCatalog(String query, Pageable pageable) {
        if (query == null || query.isBlank()) {
            return titleRepository.findAll(pageable).map(TitleDto::new);
        }

        Page<Title> searchPage = titleRepository.searchTitles(query.trim(), pageable);
        return searchPage.map(TitleDto::new);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "search_suggestions", key = "(#query ?: '') + '-' + #limit")
    public List<String> getSearchSuggestions(String query, int limit) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        Pageable pageable = PageRequest.of(0, Math.min(limit, 20));
        return titleRepository.findTitleSuggestions(query.trim(), pageable);
    }
}
