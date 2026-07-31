package com.prime.controller;

import com.prime.domain.MediaContent;
import com.prime.repository.MediaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*")
public class MediaController {

    private final MediaRepository mediaRepository;

    public MediaController(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    @GetMapping
    public ResponseEntity<List<MediaContent>> getMedia(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {

        if (type != null && !type.isEmpty()) {
            return ResponseEntity.ok(mediaRepository.findByContentType(type));
        }

        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(mediaRepository.findByTitleContainingIgnoreCase(search));
        }

        return ResponseEntity.ok(mediaRepository.findAll());
    }

    @GetMapping("/originals")
    public ResponseEntity<List<MediaContent>> getOriginals() {
        return ResponseEntity.ok(mediaRepository.findByIsOriginalTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaContent> getMediaById(@PathVariable String id) {
        return mediaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
