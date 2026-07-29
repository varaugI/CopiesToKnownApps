package com.streamflix.common.event;

import com.streamflix.common.event.listener.UserRegisteredEventListener;
import com.streamflix.common.event.listener.WatchProgressCompletedEventListener;
import com.streamflix.modules.media.worker.MediaTranscodingWorker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;

@SpringBootTest
@ActiveProfiles("test")
class EventProcessingTest {

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @MockBean
    private UserRegisteredEventListener userRegisteredEventListener;

    @MockBean
    private WatchProgressCompletedEventListener watchProgressCompletedEventListener;

    @MockBean
    private MediaTranscodingWorker mediaTranscodingWorker;

    @Test
    void publishUserRegisteredEvent_TriggersListenerAsync() {
        UserRegisteredEvent event = new UserRegisteredEvent("acc-123", "test@streamflix.com", Instant.now());
        eventPublisher.publishEvent(event);

        verify(userRegisteredEventListener, timeout(3000)).handleUserRegistered(any());
    }

    @Test
    void publishWatchProgressCompletedEvent_TriggersListenerAsync() {
        WatchProgressCompletedEvent event = new WatchProgressCompletedEvent("prof-1", "title-1", Instant.now());
        eventPublisher.publishEvent(event);

        verify(watchProgressCompletedEventListener, timeout(3000)).handleWatchProgressCompleted(any());
    }

    @Test
    void publishMediaUploadEvent_TriggersWorkerAsync() {
        MediaUploadEvent event = new MediaUploadEvent("title-1", "asset-1", Instant.now());
        eventPublisher.publishEvent(event);

        verify(mediaTranscodingWorker, timeout(3000)).processMediaUpload(any());
    }
}
