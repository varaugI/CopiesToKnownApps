package com.streamflix.modules.media.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MediaProcessingServiceTest {

    private MediaProcessingService mediaProcessingService;

    @BeforeEach
    void setUp() {
        mediaProcessingService = new MediaProcessingService();
    }

    @Test
    void generateHlsMasterPlaylist_ReturnsValidM3u8Content() {
        MediaProcessingService.HlsStreamManifest manifest = mediaProcessingService.generateHlsMasterPlaylist("asset-123");

        assertThat(manifest.masterPlaylistContent()).startsWith("#EXTM3U");
        assertThat(manifest.masterPlaylistContent()).contains("1080p.m3u8");
        assertThat(manifest.masterPlaylistContent()).contains("720p.m3u8");
        assertThat(manifest.masterPlaylistContent()).contains("480p.m3u8");
    }

    @Test
    void generateVariantPlaylist_ReturnsValidVariantM3u8() {
        String variantContent = mediaProcessingService.generateVariantPlaylist("1080p");

        assertThat(variantContent).startsWith("#EXTM3U");
        assertThat(variantContent).contains("#EXTINF:10.0");
        assertThat(variantContent).contains("#EXT-X-ENDLIST");
    }
}
