package com.youtube.controller;

import com.youtube.domain.Channel;
import com.youtube.repository.ChannelRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/channels")
@CrossOrigin(origins = "*")
public class ChannelController {

    private final ChannelRepository channelRepository;

    public ChannelController(ChannelRepository channelRepository) {
        this.channelRepository = channelRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Channel> getChannel(@PathVariable String id) {
        return channelRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/subscribe")
    public ResponseEntity<Channel> toggleSubscribe(@PathVariable String id) {
        return channelRepository.findById(id).map(ch -> {
            boolean current = Boolean.TRUE.equals(ch.getIsSubscribed());
            ch.setIsSubscribed(!current);
            ch.setSubscribersCount(current ? ch.getSubscribersCount() - 1 : ch.getSubscribersCount() + 1);
            return ResponseEntity.ok(channelRepository.save(ch));
        }).orElse(ResponseEntity.notFound().build());
    }
}
