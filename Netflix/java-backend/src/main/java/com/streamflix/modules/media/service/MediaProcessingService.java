package com.streamflix.modules.media.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class MediaProcessingService {

    private static final Logger log = LoggerFactory.getLogger(MediaProcessingService.class);

    public record HlsStreamManifest(String masterPlaylistContent, String baseStorageUrl) {}

    public HlsStreamManifest generateHlsMasterPlaylist(String mediaAssetId) {
        log.info("Generating HLS adaptive multi-bitrate master playlist for media asset: {}", mediaAssetId);

        String masterM3u8 = """
                #EXTM3U
                #EXT-X-VERSION:3

                #EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080,NAME="1080p"
                1080p.m3u8

                #EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720,NAME="720p"
                720p.m3u8

                #EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480,NAME="480p"
                480p.m3u8
                """;

        return new HlsStreamManifest(masterM3u8.trim(), "/api/v1/stream/" + mediaAssetId);
    }

    public String generateVariantPlaylist(String resolution) {
        String sampleVideoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

        return """
                #EXTM3U
                #EXT-X-VERSION:3
                #EXT-X-TARGETDURATION:10
                #EXT-X-MEDIA-SEQUENCE:0
                #EXTINF:10.0,
                %s
                #EXT-X-ENDLIST
                """.formatted(sampleVideoUrl).trim();
    }
}
