package com.streamflix.modules.identity.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.streamflix.modules.identity.dto.AuthResponse;
import com.streamflix.modules.identity.dto.LoginRequest;
import com.streamflix.modules.identity.dto.RegisterRequest;
import com.streamflix.modules.identity.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    void register_ValidPayload_Returns201AndSetsRefreshCookie() throws Exception {
        RegisterRequest request = new RegisterRequest("newuser@example.com", "Password123!", "USER");
        AuthResponse authResponse = new AuthResponse("access-jwt-token-123", 900, null);
        AuthService.AuthResult authResult = new AuthService.AuthResult(authResponse, "refresh-token-456");

        given(authService.register(any(), any(), any())).willReturn(authResult);

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Set-Cookie"))
                .andExpect(header().string("Set-Cookie", org.hamcrest.Matchers.containsString("refreshToken=refresh-token-456")))
                .andExpect(jsonPath("$.data.accessToken").value("access-jwt-token-123"));
    }

    @Test
    void login_ValidCredentials_Returns200AndAccessToken() throws Exception {
        LoginRequest request = new LoginRequest("user@example.com", "Password123!");
        AuthResponse authResponse = new AuthResponse("access-jwt-token-999", 900, null);
        AuthService.AuthResult authResult = new AuthService.AuthResult(authResponse, "refresh-token-888");

        given(authService.login(any(), any(), any())).willReturn(authResult);

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(header().exists("Set-Cookie"))
                .andExpect(jsonPath("$.data.accessToken").value("access-jwt-token-999"));
    }
}
