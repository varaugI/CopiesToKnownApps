package com.streamflix.modules.profiles.service;

import com.streamflix.common.exception.BusinessValidationException;
import com.streamflix.modules.profiles.domain.Profile;
import com.streamflix.modules.profiles.dto.CreateProfileRequest;
import com.streamflix.modules.profiles.dto.ProfileResponse;
import com.streamflix.modules.profiles.repository.ProfileRepository;
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

@ExtendWith(MockitoExtension.class)
class ProfileServiceTest {

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private ProfileService profileService;

    @Test
    void createProfile_ExceedsMaxLimit_ThrowsException() {
        given(profileRepository.countByAccountId("acc-123")).willReturn(5L);

        CreateProfileRequest request = new CreateProfileRequest("Kids", "avatar.png", "#FF0000", true, "PG", null);

        assertThatThrownBy(() -> profileService.createProfile("acc-123", request))
                .isInstanceOf(BusinessValidationException.class)
                .hasMessageContaining("Maximum profile limit (5) reached");
    }

    @Test
    void createProfile_ValidRequest_ReturnsProfileResponse() {
        given(profileRepository.countByAccountId("acc-123")).willReturn(2L);
        given(profileRepository.existsByAccountIdAndName("acc-123", "Kids Zone")).willReturn(false);
        given(profileRepository.save(any(Profile.class))).willAnswer(inv -> inv.getArgument(0));

        CreateProfileRequest request = new CreateProfileRequest("Kids Zone", "avatar.png", "#FF0000", true, "PG", "1234");
        ProfileResponse response = profileService.createProfile("acc-123", request);

        assertThat(response.getName()).isEqualTo("Kids Zone");
        assertThat(response.isKids()).isTrue();
        assertThat(response.isPinProtected()).isTrue();
    }

    @Test
    void verifyProfilePin_MatchingPin_ReturnsTrue() {
        Profile profile = new Profile("acc-123", "Cinema", "avatar.png", "#E50914", false, "18+", "9999");
        given(profileRepository.findByIdAndAccountId("prof-1", "acc-123")).willReturn(Optional.of(profile));

        boolean result = profileService.verifyProfilePin("acc-123", "prof-1", "9999");
        assertThat(result).isTrue();
    }

    @Test
    void deleteProfile_OnlyOneRemaining_ThrowsException() {
        Profile profile = new Profile("acc-123", "Primary Profile", "avatar.png", "#E50914", false, "18+", null);
        given(profileRepository.findByIdAndAccountId("prof-1", "acc-123")).willReturn(Optional.of(profile));
        given(profileRepository.countByAccountId("acc-123")).willReturn(1L);

        assertThatThrownBy(() -> profileService.deleteProfile("acc-123", "prof-1"))
                .isInstanceOf(BusinessValidationException.class)
                .hasMessageContaining("Cannot delete the only remaining profile");
    }
}
