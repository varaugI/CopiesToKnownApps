package com.prime.controller;

import com.prime.domain.MediaContent;
import com.prime.domain.WatchlistItem;
import com.prime.repository.MediaRepository;
import com.prime.repository.WatchlistRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin(origins = "*")
public class WatchlistController {

    private final WatchlistRepository watchlistRepository;
    private final MediaRepository mediaRepository;
    private static final String DEFAULT_USER = "user_me";

    public WatchlistController(WatchlistRepository watchlistRepository, MediaRepository mediaRepository) {
        this.watchlistRepository = watchlistRepository;
        this.mediaRepository = mediaRepository;
    }

    @GetMapping
    public ResponseEntity<List<WatchlistItem>> getWatchlist() {
        return ResponseEntity.ok(watchlistRepository.findByUserId(DEFAULT_USER));
    }

    @PostMapping("/{mediaId}")
    public ResponseEntity<WatchlistItem> addToWatchlist(@PathVariable String mediaId) {
        Optional<MediaContent> mediaOpt = mediaRepository.findById(mediaId);
        if (mediaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<WatchlistItem> existing = watchlistRepository.findByUserIdAndMediaId(DEFAULT_USER, mediaId);
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get());
        }

        WatchlistItem item = new WatchlistItem(
                "w_" + UUID.randomUUID().toString().substring(0, 8),
                DEFAULT_USER,
                mediaOpt.get()
        );

        return ResponseEntity.ok(watchlistRepository.save(item));
    }

    @DeleteMapping("/{mediaId}")
    public ResponseEntity<Void> removeFromWatchlist(@PathVariable String mediaId) {
        Optional<WatchlistItem> existing = watchlistRepository.findByUserIdAndMediaId(DEFAULT_USER, mediaId);
        if (existing.isPresent()) {
            watchlistRepository.delete(existing.get());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
