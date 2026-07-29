package com.streamflix.modules.search.controller;

import com.streamflix.modules.catalog.domain.Title;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.search.service.SearchService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SearchControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SearchService searchService;

    @Test
    void search_Returns200WithPaginatedResults() throws Exception {
        Title title = new Title("Stranger Things", "SERIES", "Sci-fi series", 2016, "16+", 97, "4K", "4 Seasons", "poster.jpg", "backdrop.jpg", "trailer.mp4", "Duffer Brothers", "Millie Bobby Brown", 1);
        title.setId("t1");
        TitleDto dto = new TitleDto(title);

        given(searchService.searchCatalog(eq("Stranger"), any()))
                .willReturn(new PageImpl<>(List.of(dto), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/v1/catalog/search").param("q", "Stranger"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].id").value("t1"))
                .andExpect(jsonPath("$.data.content[0].title").value("Stranger Things"));
    }

    @Test
    void getSuggestions_Returns200WithSuggestionsList() throws Exception {
        given(searchService.getSearchSuggestions(eq("Dark"), eq(5)))
                .willReturn(List.of("The Dark Knight", "Dark"));

        mockMvc.perform(get("/api/v1/catalog/search/suggestions").param("q", "Dark"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0]").value("The Dark Knight"))
                .andExpect(jsonPath("$.data[1]").value("Dark"));
    }
}
