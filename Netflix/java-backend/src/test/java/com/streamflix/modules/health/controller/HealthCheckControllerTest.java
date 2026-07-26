package com.streamflix.modules.health.controller;

import com.streamflix.common.filter.JwtAuthenticationFilter;
import com.streamflix.common.filter.RequestIdFilter;
import com.streamflix.config.SecurityConfig;
import com.streamflix.modules.identity.service.JwtTokenService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HealthCheckController.class)
@Import({RequestIdFilter.class, SecurityConfig.class, JwtAuthenticationFilter.class})
class HealthCheckControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HealthEndpoint healthEndpoint;

    @MockBean
    private JwtTokenService jwtTokenService;

    @Test
    void getHealth_ReturnsOkWithRequestIdHeader() throws Exception {
        given(healthEndpoint.health()).willReturn(Health.up().build());

        mockMvc.perform(get("/api/v1/health")
                .header(RequestIdFilter.REQUEST_ID_HEADER, "test-request-123"))
                .andExpect(status().isOk())
                .andExpect(header().string(RequestIdFilter.REQUEST_ID_HEADER, "test-request-123"))
                .andExpect(jsonPath("$.data.status").value("UP"))
                .andExpect(jsonPath("$.data.apiVersion").value("v1"))
                .andExpect(jsonPath("$.requestId").value("test-request-123"));
    }

    @Test
    void getReadiness_ReturnsReadyStatus() throws Exception {
        mockMvc.perform(get("/api/v1/readiness"))
                .andExpect(status().isOk())
                .andExpect(header().exists(RequestIdFilter.REQUEST_ID_HEADER))
                .andExpect(jsonPath("$.data.status").value("READY"));
    }
}
