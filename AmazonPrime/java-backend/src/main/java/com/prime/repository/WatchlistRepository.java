package com.prime.repository;

import com.prime.domain.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<WatchlistItem, String> {
    List<WatchlistItem> findByUserId(String userId);
    Optional<WatchlistItem> findByUserIdAndMediaId(String userId, String mediaId);
}
