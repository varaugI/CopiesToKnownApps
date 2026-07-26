package com.streamflix.modules.catalog.repository;

import com.streamflix.modules.catalog.domain.Title;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TitleRepository extends JpaRepository<Title, String>, JpaSpecificationExecutor<Title> {

    @Query("SELECT t FROM Title t WHERE t.topRank IS NOT NULL ORDER BY t.topRank ASC LIMIT 1")
    Optional<Title> findTopBillboardTitle();

    Page<Title> findByType(String type, Pageable pageable);

    @Query("SELECT DISTINCT t FROM Title t JOIN t.genres g WHERE g.slug = :genreSlug")
    Page<Title> findByGenreSlug(String genreSlug, Pageable pageable);

    @Query("SELECT t FROM Title t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.overview) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Title> searchTitles(String query, Pageable pageable);
}
