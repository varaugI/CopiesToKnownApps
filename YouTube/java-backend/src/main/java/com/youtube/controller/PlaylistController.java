package com.youtube.controller;

import com.youtube.domain.Playlist;
import com.youtube.dto.PlaylistCreateRequest;
import com.youtube.repository.PlaylistRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "*")
public class PlaylistController {

    private final PlaylistRepository playlistRepository;

    public PlaylistController(PlaylistRepository playlistRepository) {
        this.playlistRepository = playlistRepository;
    }

    @GetMapping
    public ResponseEntity<List<Playlist>> getAllPlaylists() {
        return ResponseEntity.ok(playlistRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Playlist> createPlaylist(@Valid @RequestBody PlaylistCreateRequest request) {
        Playlist playlist = new Playlist(
                "pl_" + UUID.randomUUID().toString().substring(0, 8),
                request.getTitle(),
                Boolean.TRUE.equals(request.getIsPrivate()),
                1,
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400"
        );

        Playlist saved = playlistRepository.save(playlist);
        return ResponseEntity.ok(saved);
    }
}
