package com.streamflix.modules.recommendation.service;

import com.streamflix.modules.catalog.domain.Title;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.catalog.repository.TitleRepository;
import com.streamflix.modules.profiles.domain.Profile;
import com.streamflix.modules.profiles.repository.ProfileRepository;
import com.streamflix.modules.userstate.repository.MyListRepository;
import com.streamflix.modules.userstate.repository.WatchProgressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class RecommendationServiceTest {

    @Mock
    private TitleRepository titleRepository;

    @Mock
    private WatchProgressRepository watchProgressRepository;

    @Mock
    private MyListRepository myListRepository;

    @Mock
    private ProfileRepository profileRepository;

    @InjectMocks
    private RecommendationService recommendationService;

    private Profile sampleProfile;
    private Title title1;

    @BeforeEach
    void setUp() {
        sampleProfile = new Profile("acc-1", "Main", "avatar.png", "#E50914", false, "18+", null);
        sampleProfile.setId("prof-1");

        title1 = new Title("Stranger Things", "SERIES", "Sci-Fi Series", 2016, "16+", 98, "4K", "4 Seasons", "poster.jpg", "backdrop.jpg", "trailer.mp4", "Duffer Brothers", "Millie Bobby Brown", 1);
        title1.setId("t1");
    }

    @Test
    void getRecommendationsForProfile_ColdStart_ReturnsTrendingFallback() {
        given(profileRepository.findByIdAndAccountId("prof-1", "acc-1")).willReturn(Optional.of(sampleProfile));
        given(myListRepository.findByProfileId("prof-1")).willReturn(List.of());
        given(watchProgressRepository.findContinueWatching("prof-1", PageRequest.of(0, 50))).willReturn(new PageImpl<>(List.of()));
        given(titleRepository.findAll()).willReturn(List.of(title1));

        Page<TitleDto> recommendations = recommendationService.getRecommendationsForProfile("acc-1", "prof-1", PageRequest.of(0, 10));

        assertThat(recommendations.getContent()).hasSize(1);
        assertThat(recommendations.getContent().get(0).getTitle()).isEqualTo("Stranger Things");
    }

    @Test
    void getSimilarTitles_ReturnsMatchingTitles() {
        given(titleRepository.findById("t1")).willReturn(Optional.of(title1));
        given(titleRepository.findAll()).willReturn(List.of(title1));

        List<TitleDto> similar = recommendationService.getSimilarTitles("t1", 5);

        assertThat(similar).isEmpty();
    }
}
