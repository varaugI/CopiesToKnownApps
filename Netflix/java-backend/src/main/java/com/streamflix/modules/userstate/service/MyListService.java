package com.streamflix.modules.userstate.service;

import com.streamflix.common.exception.ResourceNotFoundException;
import com.streamflix.modules.catalog.domain.Title;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.catalog.repository.TitleRepository;
import com.streamflix.modules.profiles.repository.ProfileRepository;
import com.streamflix.modules.userstate.domain.MyListEntry;
import com.streamflix.modules.userstate.dto.ToggleMyListResponse;
import com.streamflix.modules.userstate.repository.MyListRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MyListService {

    private final MyListRepository myListRepository;
    private final ProfileRepository profileRepository;
    private final TitleRepository titleRepository;

    public MyListService(
            MyListRepository myListRepository,
            ProfileRepository profileRepository,
            TitleRepository titleRepository
    ) {
        this.myListRepository = myListRepository;
        this.profileRepository = profileRepository;
        this.titleRepository = titleRepository;
    }

    @Transactional(readOnly = true)
    public Page<TitleDto> getMyListTitles(String accountId, String profileId, Pageable pageable) {
        verifyProfileOwnership(accountId, profileId);

        Page<MyListEntry> entriesPage = myListRepository.findByProfileIdOrderByAddedAtDesc(profileId, pageable);
        List<String> titleIds = entriesPage.getContent().stream().map(MyListEntry::getTitleId).toList();

        List<Title> titles = titleRepository.findAllById(titleIds);
        List<TitleDto> titleDtos = titles.stream().map(TitleDto::new).toList();

        return new PageImpl<>(titleDtos, pageable, entriesPage.getTotalElements());
    }

    @Transactional
    public void addTitle(String accountId, String profileId, String titleId) {
        verifyProfileOwnership(accountId, profileId);
        verifyTitleExists(titleId);

        if (!myListRepository.existsByProfileIdAndTitleId(profileId, titleId)) {
            MyListEntry entry = new MyListEntry(profileId, titleId);
            myListRepository.save(entry);
        }
    }

    @Transactional
    public void removeTitle(String accountId, String profileId, String titleId) {
        verifyProfileOwnership(accountId, profileId);
        myListRepository.deleteByProfileIdAndTitleId(profileId, titleId);
    }

    @Transactional
    public ToggleMyListResponse toggleTitle(String accountId, String profileId, String titleId) {
        verifyProfileOwnership(accountId, profileId);
        verifyTitleExists(titleId);

        Optional<MyListEntry> existing = myListRepository.findByProfileIdAndTitleId(profileId, titleId);
        if (existing.isPresent()) {
            myListRepository.delete(existing.get());
            return new ToggleMyListResponse(profileId, titleId, false);
        } else {
            MyListEntry entry = new MyListEntry(profileId, titleId);
            myListRepository.save(entry);
            return new ToggleMyListResponse(profileId, titleId, true);
        }
    }

    @Transactional(readOnly = true)
    public boolean isInMyList(String accountId, String profileId, String titleId) {
        verifyProfileOwnership(accountId, profileId);
        return myListRepository.existsByProfileIdAndTitleId(profileId, titleId);
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
