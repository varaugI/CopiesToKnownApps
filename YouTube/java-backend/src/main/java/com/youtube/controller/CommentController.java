package com.youtube.controller;

import com.youtube.domain.Comment;
import com.youtube.dto.CommentCreateRequest;
import com.youtube.repository.CommentRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/videos/{videoId}/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentRepository commentRepository;

    public CommentController(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable String videoId) {
        return ResponseEntity.ok(commentRepository.findByVideoId(videoId));
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(
            @PathVariable String videoId,
            @Valid @RequestBody CommentCreateRequest request) {

        Comment comment = new Comment(
                "c_" + UUID.randomUUID().toString().substring(0, 8),
                videoId,
                request.getUserName() != null ? request.getUserName() : "Alex Rivera",
                request.getUserAvatar() != null ? request.getUserAvatar() : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
                request.getText(),
                "Just now",
                0L,
                false,
                false,
                false
        );

        Comment saved = commentRepository.save(comment);
        return ResponseEntity.ok(saved);
    }
}
