package com.netflixcopy.catalog;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CatalogController.class)
@Import(CatalogService.class)
class CatalogControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void returnsTheCatalog() throws Exception {
        mockMvc.perform(get("/api/catalog"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.featured.name").value("The Last Horizon"))
                .andExpect(jsonPath("$.featured.isNew").value(true))
                .andExpect(jsonPath("$.titles.length()").value(12))
                .andExpect(jsonPath("$.rows[1].slug").value("top-ten"));
    }

    @Test
    void exposesAHealthBoundary() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }
}
