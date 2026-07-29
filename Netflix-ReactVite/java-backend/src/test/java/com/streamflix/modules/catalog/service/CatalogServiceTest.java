package com.streamflix.modules.catalog.service;

import com.streamflix.common.exception.ResourceNotFoundException;
import com.streamflix.modules.catalog.domain.Genre;
import com.streamflix.modules.catalog.domain.Title;
import com.streamflix.modules.catalog.dto.GenreDto;
import com.streamflix.modules.catalog.dto.TitleDetailDto;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.catalog.repository.GenreRepository;
import com.streamflix.modules.catalog.repository.TitleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class CatalogServiceTest {

    @Mock
    private TitleRepository titleRepository;

    @Mock
    private GenreRepository genreRepository;

    @InjectMocks
    private CatalogService catalogService;

    @Test
    void getTitles_WithSearchQuery_CallsSearchRepository() {
        Pageable pageable = PageRequest.of(0, 10);
        Title title = new Title("Inception", "MOVIE", "Dream share", 2010, "13+", 96, "4K", "2h 28m", "poster.jpg", "backdrop.jpg", "trailer.mp4", "Nolan", "DiCaprio", 1);
        given(titleRepository.searchTitles("Inception", pageable)).willReturn(new PageImpl<>(List.of(title)));

        Page<TitleDto> result = catalogService.getTitles(null, null, "Inception", pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getTitle()).isEqualTo("Inception");
    }

    @Test
    void getTitleById_ExistingId_ReturnsTitleDetailDto() {
        Title title = new Title("Stranger Things", "SERIES", "Supernatural town", 2016, "16+", 98, "4K", "4 Seasons", "poster.jpg", "backdrop.jpg", "trailer.mp4", "Duffer Brothers", "Millie Bobby Brown", 1);
        given(titleRepository.findById("m1")).willReturn(Optional.of(title));

        TitleDetailDto detail = catalogService.getTitleById("m1");

        assertThat(detail.getTitle()).isEqualTo("Stranger Things");
        assertThat(detail.getType()).isEqualTo("SERIES");
    }

    @Test
    void getTitleById_MissingId_ThrowsResourceNotFoundException() {
        given(titleRepository.findById("missing")).willReturn(Optional.empty());

        assertThatThrownBy(() -> catalogService.getTitleById("missing"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Title not found");
    }

    @Test
    void getGenres_ReturnsMappedGenreList() {
        Genre action = new Genre("Action", "action");
        given(genreRepository.findAll()).willReturn(List.of(action));

        List<GenreDto> result = catalogService.getGenres();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Action");
        assertThat(result.get(0).getSlug()).isEqualTo("action");
    }
}
