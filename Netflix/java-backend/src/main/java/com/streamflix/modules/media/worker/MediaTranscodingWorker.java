package com.streamflix.modules.media.worker;

import com.streamflix.common.event.MediaUploadEvent;
import com.streamflix.modules.media.service.MediaProcessingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class MediaTranscodingWorker {

    private static final Logger log = LoggerFactory.getLogger(MediaTranscodingWorker.class);
    private final MediaProcessingService mediaProcessingService;

    public MediaTranscodingWorker(MediaProcessingService mediaProcessingService) {
        this.mediaProcessingService = mediaProcessingService;
    }

    @Async
    @EventListener
    public void processMediaUpload(MediaUploadEvent event) {
        log.info("Starting background HLS transcoding worker for title {} asset {}", event.titleId(), event.mediaAssetId());
        MediaProcessingService.HlsStreamManifest manifest = mediaProcessingService.generateHlsMasterPlaylist(event.mediaAssetId());
        log.info("Successfully completed async HLS transcoding for asset {}: \n{}", event.mediaAssetId(), manifest.masterPlaylistContent());
    }
}
