package com.streamflix.modules.userstate.service;

import com.streamflix.common.event.WatchProgressCompletedEvent;
import com.streamflix.common.exception.ResourceNotFoundException;
import com.streamflix.modules.catalog.repository.TitleRepository;
import com.streamflix.modules.profiles.repository.ProfileRepository;
import com.streamflix.modules.userstate.domain.WatchProgress;
import com.streamflix.modules.userstate.dto.UpdateProgressRequest;
import com.streamflix.modules.userstate.dto.WatchProgressDto;
import com.streamflix.modules.userstate.repository.WatchProgressRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class WatchProgressService {

    private final WatchProgressRepository watchProgressRepository;
    private final ProfileRepository profileRepository;
    private final TitleRepository titleRepository;
    private final ApplicationEventPublisher eventPublisher;

    public WatchProgressService(
            WatchProgressRepository watchProgressRepository,
            ProfileRepository profileRepository,
            TitleRepository titleRepository,
            ApplicationEventPublisher eventPublisher
    ) {
        this.watchProgressRepository = watchProgressRepository;
        this.profileRepository = profileRepository;
        this.titleRepository = titleRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public WatchProgressDto updateProgress(String accountId, String profileId, UpdateProgressRequest request) {
        verifyProfileOwnership(accountId, profileId);
        verifyTitleExists(request.getTitleId());

        WatchProgress progress = watchProgressRepository.findByProfileIdAndTitleId(profileId, request.getTitleId())
                .orElseGet(() -> new WatchProgress(profileId, request.getTitleId(), request.getEpisodeId(), 0, 0, false));

        progress.setEpisodeId(request.getEpisodeId());
        progress.setProgressSeconds(request.getProgressSeconds());
        progress.setDurationSeconds(request.getDurationSeconds());

        // Completion logic: completed if progress >= 90% or remaining <= 30 seconds
        boolean isCompleted = (request.getProgressSeconds() >= (int) (request.getDurationSeconds() * 0.9)) ||
                              (request.getDurationSeconds() - request.getProgressSeconds() <= 30);
        progress.setCompleted(isCompleted);
        progress.setLastWatchedAt(Instant.now());

        WatchProgress saved = watchProgressRepository.save(progress);

        if (isCompleted && eventPublisher != null) {
            eventPublisher.publishEvent(new WatchProgressCompletedEvent(profileId, request.getTitleId(), Instant.now()));
        }

        return new WatchProgressDto(saved);
    }

    @Transactional(readOnly = true)
    public Optional<WatchProgressDto> getProgress(String accountId, String profileId, String titleId) {
        verifyProfileOwnership(accountId, profileId);
        return watchProgressRepository.findByProfileIdAndTitleId(profileId, titleId)
                .map(WatchProgressDto::new);
    }

    @Transactional(readOnly = true)
    public Page<WatchProgressDto> getContinueWatching(String accountId, String profileId, Pageable pageable) {
        verifyProfileOwnership(accountId, profileId);
        return watchProgressRepository.findContinueWatching(profileId, pageable)
                .map(WatchProgressDto::new);
    }

    private void verifyProfileOwnership(String accountId, String profileId) {
        if (!profileRepository.findByIdAndAccountId(profileId, accountId).isPresent()) {
            throw new ResourceNotFoundException("Profile not found or access denied");
        }
    }

    private void verifyTitleExists(String titleId) {
        if (!titleRepository.existsById(titleId)) {
            throw new ResourceNotFoundException("Title not found with ID: " + titleId);
        }
    }
}
