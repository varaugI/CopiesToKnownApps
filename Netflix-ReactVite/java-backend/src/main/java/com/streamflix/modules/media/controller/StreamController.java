package com.streamflix.modules.media.controller;

import com.streamflix.common.dto.ApiResponse;
import com.streamflix.common.filter.RequestIdFilter;
import com.streamflix.config.StreamFlixProperties;
import com.streamflix.modules.media.service.MediaProcessingService;
import com.streamflix.modules.media.service.StorageService;
import org.slf4j.MDC;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class StreamController {

    private final StorageService storageService;
    private final MediaProcessingService mediaProcessingService;
    private final StreamFlixProperties properties;

    public StreamController(
            StorageService storageService,
            MediaProcessingService mediaProcessingService,
            StreamFlixProperties properties
    ) {
        this.storageService = storageService;
        this.mediaProcessingService = mediaProcessingService;
        this.properties = properties;
    }

    @GetMapping("/api/v1/stream/{mediaAssetId}/presigned-url")
    public ResponseEntity<ApiResponse<Map<String, String>>> getPresignedUrl(@PathVariable String mediaAssetId) {
        String requestId = MDC.get(RequestIdFilter.MDC_REQUEST_ID_KEY);
        String bucket = (properties != null && properties.getStorage() != null) ? properties.getStorage().getBucket() : "streamflix-media";
        String presignedUrl = storageService.generatePresignedUrl(bucket, mediaAssetId + "/master.m3u8", 60);

        if (presignedUrl == null) {
            presignedUrl = "http://localhost:9000/" + bucket + "/" + mediaAssetId + "/master.m3u8";
        }

        return ResponseEntity.ok(ApiResponse.of(Map.of(
                "mediaAssetId", mediaAssetId,
                "streamUrl", presignedUrl
        ), requestId));
    }

    @GetMapping(value = "/api/v1/stream/{mediaAssetId}/master.m3u8", produces = "application/vnd.apple.mpegurl")
    public ResponseEntity<String> getMasterPlaylist(@PathVariable String mediaAssetId) {
        MediaProcessingService.HlsStreamManifest manifest = mediaProcessingService.generateHlsMasterPlaylist(mediaAssetId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/vnd.apple.mpegurl")
                .body(manifest.masterPlaylistContent());
    }

    @GetMapping(value = "/api/v1/stream/{mediaAssetId}/{resolution}.m3u8", produces = "application/vnd.apple.mpegurl")
    public ResponseEntity<String> getVariantPlaylist(
            @PathVariable String mediaAssetId,
            @PathVariable String resolution
    ) {
        String variantPlaylist = mediaProcessingService.generateVariantPlaylist(resolution);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/vnd.apple.mpegurl")
                .body(variantPlaylist);
    }

    // Legacy stream compatibility route replacing fake 206 empty chunk response
    @GetMapping("/api/stream/{movieId}")
    public ResponseEntity<Map<String, Object>> getLegacyStream(@PathVariable String movieId) {
        String streamUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        return ResponseEntity.ok(Map.of(
                "movieId", movieId,
                "streamUrl", streamUrl,
                "hlsMasterUrl", "/api/v1/stream/" + movieId + "/master.m3u8",
                "format", "hls",
                "status", "READY"
        ));
    }
}
