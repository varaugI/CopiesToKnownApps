package com.streamflix.modules.catalog.repository;

import com.streamflix.modules.catalog.domain.Episode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EpisodeRepository extends JpaRepository<Episode, String> {
    List<Episode> findBySeasonIdOrderByEpisodeNumberAsc(String seasonId);
}
