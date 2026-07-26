package com.streamflix.modules.catalog.service;

import com.streamflix.modules.catalog.domain.Title;
import com.streamflix.modules.catalog.dto.TitleDto;
import com.streamflix.modules.catalog.repository.TitleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.cache.CacheManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@SpringBootTest
@ActiveProfiles("test")
class CatalogCacheTest {

    @Autowired
    private CatalogService catalogService;

    @Autowired
    private CacheManager cacheManager;

    @MockBean
    private TitleRepository titleRepository;

    @Test
    void getBillboardTitle_CachesResultOnSubsequentCalls() {
        Title sampleTitle = new Title("Test Billboard", "MOVIE", "desc", 2024, "18+", 98, "4K", "120m", "thumb.jpg", "banner.jpg", "url.mp4", "Director", "Cast", 1);
        sampleTitle.setId("billboard-1");

        given(titleRepository.findTopBillboardTitle()).willReturn(Optional.of(sampleTitle));

        TitleDto firstCall = catalogService.getBillboardTitle();
        TitleDto secondCall = catalogService.getBillboardTitle();

        assertThat(firstCall.getId()).isEqualTo("billboard-1");
        assertThat(secondCall.getId()).isEqualTo("billboard-1");

        // Verify repository was queried only once due to @Cacheable
        verify(titleRepository, times(1)).findTopBillboardTitle();
    }
}
