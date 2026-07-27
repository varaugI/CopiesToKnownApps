package com.streamflix.common.event.listener;

import com.streamflix.common.event.WatchProgressCompletedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class WatchProgressCompletedEventListener {

    private static final Logger log = LoggerFactory.getLogger(WatchProgressCompletedEventListener.class);

    @Async
    @EventListener
    @CacheEvict(value = "recommendations", allEntries = true)
    public void handleWatchProgressCompleted(WatchProgressCompletedEvent event) {
        log.info("Watch progress completed for profile: {} on title: {}. Evicting recommendation cache.", event.profileId(), event.titleId());
    }
}
