package com.streamflix.modules.userstate.repository;

import com.streamflix.modules.userstate.domain.MyListEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MyListRepository extends JpaRepository<MyListEntry, String> {
    Page<MyListEntry> findByProfileIdOrderByAddedAtDesc(String profileId, Pageable pageable);
    List<MyListEntry> findByProfileId(String profileId);
    Optional<MyListEntry> findByProfileIdAndTitleId(String profileId, String titleId);
    boolean existsByProfileIdAndTitleId(String profileId, String titleId);
    void deleteByProfileIdAndTitleId(String profileId, String titleId);
}
