package com.streamflix.modules.media.service;

import com.streamflix.config.StreamFlixProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class StorageServiceTest {

    private StorageService storageService;
    private StreamFlixProperties properties;

    @BeforeEach
    void setUp() {
        properties = new StreamFlixProperties();
        properties.getStorage().setEndpoint("http://localhost:9000");
        properties.getStorage().setBucket("test-bucket");
        storageService = new MinioStorageService(properties);
    }

    @Test
    void generatePresignedUrl_ReturnsValidUrlString() {
        String url = storageService.generatePresignedUrl("test-bucket", "asset-1/master.m3u8", 60);

        assertThat(url).isNotBlank();
        assertThat(url).contains("asset-1/master.m3u8");
    }
}
