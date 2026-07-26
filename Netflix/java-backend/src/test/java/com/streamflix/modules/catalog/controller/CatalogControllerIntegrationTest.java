package com.streamflix.modules.catalog.controller;

import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.catalog.service.CatalogService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CatalogControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CatalogService catalogService;

    @Test
    void getTitles_Returns200WithPaginatedTitles() throws Exception {
        TitleDto titleDto = new TitleDto();
        titleDto.setId("m1");
        titleDto.setTitle("Stranger Things");

        given(catalogService.getTitles(any(), any(), any(), any()))
                .willReturn(new PageImpl<>(List.of(titleDto)));

        mockMvc.perform(get("/api/v1/catalog/titles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].id").value("m1"))
                .andExpect(jsonPath("$.data.content[0].title").value("Stranger Things"));
    }

    @Test
    void getLegacyMovies_ReturnsUnpaginatedList() throws Exception {
        TitleDto titleDto = new TitleDto();
        titleDto.setId("m2");
        titleDto.setTitle("The Dark Knight");

        given(catalogService.getTitles(any(), any(), any(), any()))
                .willReturn(new PageImpl<>(List.of(titleDto)));

        mockMvc.perform(get("/api/movies"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("m2"))
                .andExpect(jsonPath("$[0].title").value("The Dark Knight"));
    }
}
