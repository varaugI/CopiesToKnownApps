package com.streamflix.modules.catalog.service;

import com.streamflix.common.exception.ResourceNotFoundException;
import com.streamflix.modules.catalog.domain.Title;
import com.streamflix.modules.catalog.dto.GenreDto;
import com.streamflix.modules.catalog.dto.TitleDetailDto;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.catalog.repository.GenreRepository;
import com.streamflix.modules.catalog.repository.TitleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CatalogService {

    private final TitleRepository titleRepository;
    private final GenreRepository genreRepository;

    public CatalogService(TitleRepository titleRepository, GenreRepository genreRepository) {
        this.titleRepository = titleRepository;
        this.genreRepository = genreRepository;
    }

    @Transactional(readOnly = true)
    public Page<TitleDto> getTitles(String type, String genreSlug, String query, Pageable pageable) {
        Page<Title> titlesPage;

        if (query != null && !query.isBlank()) {
            titlesPage = titleRepository.searchTitles(query.trim(), pageable);
        } else if (genreSlug != null && !genreSlug.isBlank()) {
            titlesPage = titleRepository.findByGenreSlug(genreSlug.trim().toLowerCase(), pageable);
        } else if (type != null && !type.isBlank()) {
            titlesPage = titleRepository.findByType(type.trim().toUpperCase(), pageable);
        } else {
            titlesPage = titleRepository.findAll(pageable);
        }

        return titlesPage.map(TitleDto::new);
    }

    @Transactional(readOnly = true)
    public TitleDetailDto getTitleById(String id) {
        Title title = titleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Title not found with ID: " + id));
        return new TitleDetailDto(title);
    }

    @Transactional(readOnly = true)
    public TitleDto getBillboardTitle() {
        Title billboard = titleRepository.findTopBillboardTitle()
                .orElseGet(() -> titleRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("No catalog titles available")));
        return new TitleDto(billboard);
    }

    @Transactional(readOnly = true)
    public List<GenreDto> getGenres() {
        return genreRepository.findAll()
                .stream()
                .map(GenreDto::new)
                .toList();
    }
}
