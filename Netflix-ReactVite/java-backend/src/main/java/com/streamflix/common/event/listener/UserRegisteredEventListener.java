package com.streamflix.common.event.listener;

import com.streamflix.common.event.UserRegisteredEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class UserRegisteredEventListener {

    private static final Logger log = LoggerFactory.getLogger(UserRegisteredEventListener.class);

    @Async
    @EventListener
    public void handleUserRegistered(UserRegisteredEvent event) {
        log.info("Processing async onboarding and welcome notification for user account: {} ({})", event.accountId(), event.email());
    }
}
