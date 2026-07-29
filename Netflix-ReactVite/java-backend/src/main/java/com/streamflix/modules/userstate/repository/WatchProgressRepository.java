package com.streamflix.modules.userstate.repository;

import com.streamflix.modules.userstate.domain.WatchProgress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WatchProgressRepository extends JpaRepository<WatchProgress, String> {
    Optional<WatchProgress> findByProfileIdAndTitleId(String profileId, String titleId);

    @Query("SELECT w FROM WatchProgress w WHERE w.profileId = :profileId AND w.completed = false ORDER BY w.lastWatchedAt DESC")
    Page<WatchProgress> findContinueWatching(String profileId, Pageable pageable);
}
