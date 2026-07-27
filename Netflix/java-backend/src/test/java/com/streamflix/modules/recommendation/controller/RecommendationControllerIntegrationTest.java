package com.streamflix.modules.recommendation.controller;

import com.streamflix.modules.catalog.domain.Title;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.recommendation.service.RecommendationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RecommendationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RecommendationService recommendationService;

    @Test
    void getSimilarTitles_Returns200WithSimilarList() throws Exception {
        Title title = new Title("Inception", "MOVIE", "Thriller", 2010, "13+", 98, "4K", "148m", "poster.jpg", "backdrop.jpg", "trailer.mp4", "Nolan", "DiCap", 2);
        title.setId("t2");
        TitleDto dto = new TitleDto(title);

        given(recommendationService.getSimilarTitles(eq("t1"), eq(6))).willReturn(List.of(dto));

        mockMvc.perform(get("/api/v1/recommendations/similar/t1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value("t2"))
                .andExpect(jsonPath("$.data[0].title").value("Inception"));
    }
}
