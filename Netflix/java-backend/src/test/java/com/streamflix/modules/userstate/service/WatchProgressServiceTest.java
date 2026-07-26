package com.streamflix.modules.userstate.service;

import com.streamflix.modules.catalog.repository.TitleRepository;
import com.streamflix.modules.profiles.domain.Profile;
import com.streamflix.modules.profiles.repository.ProfileRepository;
import com.streamflix.modules.userstate.domain.WatchProgress;
import com.streamflix.modules.userstate.dto.UpdateProgressRequest;
import com.streamflix.modules.userstate.dto.WatchProgressDto;
import com.streamflix.modules.userstate.repository.WatchProgressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class WatchProgressServiceTest {

    @Mock
    private WatchProgressRepository watchProgressRepository;

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private TitleRepository titleRepository;

    @InjectMocks
    private WatchProgressService watchProgressService;

    private Profile sampleProfile;

    @BeforeEach
    void setUp() {
        sampleProfile = new Profile("acc-123", "Main Profile", "avatar.png", "#E50914", false, "18+", null);
        sampleProfile.setId("prof-1");
    }

    @Test
    void updateProgress_Below90Percent_MarksNotCompleted() {
        given(profileRepository.findByIdAndAccountId("prof-1", "acc-123")).willReturn(Optional.of(sampleProfile));
        given(titleRepository.existsById("m1")).willReturn(true);
        given(watchProgressRepository.findByProfileIdAndTitleId("prof-1", "m1")).willReturn(Optional.empty());
        given(watchProgressRepository.save(any(WatchProgress.class))).willAnswer(inv -> inv.getArgument(0));

        UpdateProgressRequest request = new UpdateProgressRequest("m1", "e1", 500, 3600);
        WatchProgressDto result = watchProgressService.updateProgress("acc-123", "prof-1", request);

        assertThat(result.isCompleted()).isFalse();
        assertThat(result.getProgressSeconds()).isEqualTo(500);
    }

    @Test
    void updateProgress_Above90Percent_MarksCompleted() {
        given(profileRepository.findByIdAndAccountId("prof-1", "acc-123")).willReturn(Optional.of(sampleProfile));
        given(titleRepository.existsById("m1")).willReturn(true);
        given(watchProgressRepository.findByProfileIdAndTitleId("prof-1", "m1")).willReturn(Optional.empty());
        given(watchProgressRepository.save(any(WatchProgress.class))).willAnswer(inv -> inv.getArgument(0));

        UpdateProgressRequest request = new UpdateProgressRequest("m1", "e1", 3400, 3600);
        WatchProgressDto result = watchProgressService.updateProgress("acc-123", "prof-1", request);

        assertThat(result.isCompleted()).isTrue();
    }
}
