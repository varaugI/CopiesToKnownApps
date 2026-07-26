package com.streamflix.modules.userstate.service;

import com.streamflix.common.exception.ResourceNotFoundException;
import com.streamflix.modules.catalog.repository.TitleRepository;
import com.streamflix.modules.profiles.domain.Profile;
import com.streamflix.modules.profiles.repository.ProfileRepository;
import com.streamflix.modules.userstate.domain.MyListEntry;
import com.streamflix.modules.userstate.dto.ToggleMyListResponse;
import com.streamflix.modules.userstate.repository.MyListRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class MyListServiceTest {

    @Mock
    private MyListRepository myListRepository;

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private TitleRepository titleRepository;

    @InjectMocks
    private MyListService myListService;

    private Profile sampleProfile;

    @BeforeEach
    void setUp() {
        sampleProfile = new Profile("acc-123", "Main Profile", "avatar.png", "#E50914", false, "18+", null);
        sampleProfile.setId("prof-1");
    }

    @Test
    void toggleTitle_NewTitle_AddsToMyList() {
        given(profileRepository.findByIdAndAccountId("prof-1", "acc-123")).willReturn(Optional.of(sampleProfile));
        given(titleRepository.existsById("m1")).willReturn(true);
        given(myListRepository.findByProfileIdAndTitleId("prof-1", "m1")).willReturn(Optional.empty());

        ToggleMyListResponse response = myListService.toggleTitle("acc-123", "prof-1", "m1");

        assertThat(response.isInMyList()).isTrue();
        verify(myListRepository).save(any(MyListEntry.class));
    }

    @Test
    void toggleTitle_ExistingTitle_RemovesFromMyList() {
        MyListEntry entry = new MyListEntry("prof-1", "m1");
        given(profileRepository.findByIdAndAccountId("prof-1", "acc-123")).willReturn(Optional.of(sampleProfile));
        given(titleRepository.existsById("m1")).willReturn(true);
        given(myListRepository.findByProfileIdAndTitleId("prof-1", "m1")).willReturn(Optional.of(entry));

        ToggleMyListResponse response = myListService.toggleTitle("acc-123", "prof-1", "m1");

        assertThat(response.isInMyList()).isFalse();
        verify(myListRepository).delete(entry);
    }

    @Test
    void addTitle_UnauthorizedProfile_ThrowsException() {
        given(profileRepository.findByIdAndAccountId("prof-99", "acc-123")).willReturn(Optional.empty());

        assertThatThrownBy(() -> myListService.addTitle("acc-123", "prof-99", "m1"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Profile not found or access denied");
    }
}
