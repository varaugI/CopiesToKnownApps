package com.streamflix.modules.catalog.repository;

import com.streamflix.modules.catalog.domain.Season;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeasonRepository extends JpaRepository<Season, String> {
    List<Season> findByTitleIdOrderBySeasonNumberAsc(String titleId);
}
