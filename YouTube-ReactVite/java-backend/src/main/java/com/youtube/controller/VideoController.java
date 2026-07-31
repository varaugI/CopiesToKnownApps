package com.youtube.controller;

import com.youtube.domain.Channel;
import com.youtube.domain.Video;
import com.youtube.dto.VideoCreateRequest;
import com.youtube.repository.ChannelRepository;
import com.youtube.repository.VideoRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin(origins = "*")
public class VideoController {

    private final VideoRepository videoRepository;
    private final ChannelRepository channelRepository;

    public VideoController(VideoRepository videoRepository, ChannelRepository channelRepository) {
        this.videoRepository = videoRepository;
        this.channelRepository = channelRepository;
    }

    @GetMapping
    public ResponseEntity<List<Video>> getAllVideos(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        if (category != null && !category.isEmpty() && !"All".equalsIgnoreCase(category)) {
            return ResponseEntity.ok(videoRepository.findByCategory(category));
        }

        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(videoRepository.findByTitleContainingIgnoreCase(search));
        }

        return ResponseEntity.ok(videoRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideoById(@PathVariable String id) {
        return videoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Video> createVideo(@Valid @RequestBody VideoCreateRequest request) {
        Channel defaultChannel = channelRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> channelRepository.save(new Channel(
                        "ch_default", "Alex Rivera", "@alex_rivera",
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
                        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200",
                        14200L, true, true
                )));

        Video video = new Video(
                "yt_" + UUID.randomUUID().toString().substring(0, 8),
                request.getTitle(),
                request.getDescription(),
                request.getVideoUrl() != null ? request.getVideoUrl() : "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
                request.getThumbnail() != null ? request.getThumbnail() : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
                "12:30",
                1L,
                1L,
                0L,
                request.getCategory() != null ? request.getCategory() : "Coding",
                "JUST NOW",
                "rgba(0, 150, 255, 0.4)",
                false,
                defaultChannel
        );

        Video saved = videoRepository.save(video);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Video> toggleLike(@PathVariable String id) {
        return videoRepository.findById(id).map(video -> {
            video.setLikesCount(video.getLikesCount() + 1);
            return ResponseEntity.ok(videoRepository.save(video));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Video> incrementView(@PathVariable String id) {
        return videoRepository.findById(id).map(video -> {
            video.setViewsCount(video.getViewsCount() + 1);
            return ResponseEntity.ok(videoRepository.save(video));
        }).orElse(ResponseEntity.notFound().build());
    }
}
