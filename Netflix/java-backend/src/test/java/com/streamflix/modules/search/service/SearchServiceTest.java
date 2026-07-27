package com.streamflix.modules.search.service;

import com.streamflix.modules.catalog.domain.Title;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.catalog.repository.TitleRepository;
import org.junit.jupiter.api.BeforeEach;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class SearchServiceTest {

    @Mock
    private TitleRepository titleRepository;

    @InjectMocks
    private SearchService searchService;

    private Title sampleTitle;

    @BeforeEach
    void setUp() {
        sampleTitle = new Title("Inception", "MOVIE", "A mind-bending thriller", 2010, "13+", 98, "4K", "148m", "poster.jpg", "backdrop.jpg", "trailer.mp4", "Christopher Nolan", "Leonardo DiCaprio", 2);
        sampleTitle.setId("title-inc");
    }

    @Test
    void searchCatalog_WithQuery_ReturnsMatchingTitles() {
        Pageable pageable = PageRequest.of(0, 20);
        Page<Title> titlePage = new PageImpl<>(List.of(sampleTitle), pageable, 1);

        given(titleRepository.searchTitles("Inception", pageable)).willReturn(titlePage);

        Page<TitleDto> results = searchService.searchCatalog("Inception", pageable);

        assertThat(results.getContent()).hasSize(1);
        assertThat(results.getContent().get(0).getTitle()).isEqualTo("Inception");
    }

    @Test
    void getSearchSuggestions_ReturnsTitleSuggestionsList() {
        given(titleRepository.findTitleSuggestions(eq("Inc"), any(Pageable.class)))
                .willReturn(List.of("Inception", "Inception: Special Edition"));

        List<String> suggestions = searchService.getSearchSuggestions("Inc", 5);

        assertThat(suggestions).containsExactly("Inception", "Inception: Special Edition");
    }
}
