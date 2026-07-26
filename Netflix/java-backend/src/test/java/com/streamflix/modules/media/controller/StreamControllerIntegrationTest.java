package com.streamflix.modules.media.controller;

import com.streamflix.modules.media.service.MediaProcessingService;
import com.streamflix.modules.media.service.StorageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class StreamControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StorageService storageService;

    @MockBean
    private MediaProcessingService mediaProcessingService;

    @Test
    void getPresignedUrl_Returns200WithStreamUrl() throws Exception {
        given(storageService.generatePresignedUrl(anyString(), anyString(), anyInt()))
                .willReturn("http://minio:9000/presigned-url-123");

        mockMvc.perform(get("/api/v1/stream/asset-1/presigned-url"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.mediaAssetId").value("asset-1"))
                .andExpect(jsonPath("$.data.streamUrl").value("http://minio:9000/presigned-url-123"));
    }

    @Test
    void getMasterPlaylist_ReturnsHlsHeaderAndPlaylist() throws Exception {
        given(mediaProcessingService.generateHlsMasterPlaylist("asset-1"))
                .willReturn(new MediaProcessingService.HlsStreamManifest("#EXTM3U\n#EXT-X-VERSION:3", "/api/v1/stream/asset-1"));

        mockMvc.perform(get("/api/v1/stream/asset-1/master.m3u8"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", org.hamcrest.Matchers.containsString("vnd.apple.mpegurl")))
                .andExpect(content().string(org.hamcrest.Matchers.containsString("#EXTM3U")));
    }
}
