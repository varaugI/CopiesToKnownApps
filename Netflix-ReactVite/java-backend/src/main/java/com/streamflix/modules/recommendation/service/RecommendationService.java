package com.streamflix.modules.recommendation.service;

import com.streamflix.common.exception.ResourceNotFoundException;
import com.streamflix.modules.catalog.domain.Title;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.catalog.repository.TitleRepository;
import com.streamflix.modules.profiles.repository.ProfileRepository;
import com.streamflix.modules.userstate.domain.MyListEntry;
import com.streamflix.modules.userstate.domain.WatchProgress;
import com.streamflix.modules.userstate.repository.MyListRepository;
import com.streamflix.modules.userstate.repository.WatchProgressRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final TitleRepository titleRepository;
    private final WatchProgressRepository watchProgressRepository;
    private final MyListRepository myListRepository;
    private final ProfileRepository profileRepository;

    public RecommendationService(
            TitleRepository titleRepository,
            WatchProgressRepository watchProgressRepository,
            MyListRepository myListRepository,
            ProfileRepository profileRepository
    ) {
        this.titleRepository = titleRepository;
        this.watchProgressRepository = watchProgressRepository;
        this.myListRepository = myListRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "recommendations", key = "#profileId + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<TitleDto> getRecommendationsForProfile(String accountId, String profileId, Pageable pageable) {
        verifyProfileOwnership(accountId, profileId);

        List<MyListEntry> myListEntries = myListRepository.findByProfileId(profileId);
        List<WatchProgress> progressEntries = watchProgressRepository.findContinueWatching(profileId, PageRequest.of(0, 50)).getContent();

        Set<String> interactedTitleIds = new HashSet<>();
        if (myListEntries != null) myListEntries.forEach(e -> interactedTitleIds.add(e.getTitleId()));
        if (progressEntries != null) progressEntries.forEach(w -> interactedTitleIds.add(w.getTitleId()));

        List<Title> allTitles = titleRepository.findAll();

        if (interactedTitleIds.isEmpty()) {
            List<TitleDto> fallback = allTitles.stream()
                    .sorted(Comparator.comparing(Title::getMatchScore, Comparator.nullsLast(Comparator.reverseOrder())))
                    .skip((long) pageable.getPageNumber() * pageable.getPageSize())
                    .limit(pageable.getPageSize())
                    .map(TitleDto::new)
                    .toList();

            return new PageImpl<>(fallback, pageable, allTitles.size());
        }

        Set<String> preferredGenres = allTitles.stream()
                .filter(t -> interactedTitleIds.contains(t.getId()))
                .flatMap(t -> t.getGenres().stream())
                .map(g -> g.getSlug())
                .collect(Collectors.toSet());

        List<TitleDto> recommended = allTitles.stream()
                .filter(t -> !interactedTitleIds.contains(t.getId()))
                .sorted((t1, t2) -> {
                    long score1 = t1.getGenres().stream().filter(g -> preferredGenres.contains(g.getSlug())).count();
                    long score2 = t2.getGenres().stream().filter(g -> preferredGenres.contains(g.getSlug())).count();
                    return Long.compare(score2, score1);
                })
                .map(TitleDto::new)
                .toList();

        if (recommended.isEmpty()) {
            recommended = allTitles.stream().map(TitleDto::new).toList();
        }

        int start = Math.min((int) pageable.getOffset(), recommended.size());
        int end = Math.min((start + pageable.getPageSize()), recommended.size());

        return new PageImpl<>(recommended.subList(start, end), pageable, recommended.size());
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "similar_titles", key = "#titleId + '-' + #limit")
    public List<TitleDto> getSimilarTitles(String titleId, int limit) {
        Title target = titleRepository.findById(titleId)
                .orElseThrow(() -> new ResourceNotFoundException("Title not found with ID: " + titleId));

        Set<String> targetGenreSlugs = target.getGenres().stream().map(g -> g.getSlug()).collect(Collectors.toSet());

        return titleRepository.findAll().stream()
                .filter(t -> !t.getId().equals(titleId))
                .sorted((t1, t2) -> {
                    long score1 = t1.getGenres().stream().filter(g -> targetGenreSlugs.contains(g.getSlug())).count();
                    long score2 = t2.getGenres().stream().filter(g -> targetGenreSlugs.contains(g.getSlug())).count();
                    return Long.compare(score2, score1);
                })
                .limit(limit)
                .map(TitleDto::new)
                .toList();
    }

    private void verifyProfileOwnership(String accountId, String profileId) {
        if (!profileRepository.findByIdAndAccountId(profileId, accountId).isPresent()) {
            throw new ResourceNotFoundException("Profile not found or access denied");
        }
    }
}
