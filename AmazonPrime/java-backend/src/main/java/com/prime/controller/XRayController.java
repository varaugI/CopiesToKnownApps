package com.prime.controller;

import com.prime.domain.CastMember;
import com.prime.domain.MediaContent;
import com.prime.domain.SoundtrackTrack;
import com.prime.dto.XRayResponse;
import com.prime.repository.CastRepository;
import com.prime.repository.MediaRepository;
import com.prime.repository.SoundtrackRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = "*")
public class XRayController {

    private final MediaRepository mediaRepository;
    private final CastRepository castRepository;
    private final SoundtrackRepository soundtrackRepository;

    public XRayController(MediaRepository mediaRepository, CastRepository castRepository, SoundtrackRepository soundtrackRepository) {
        this.mediaRepository = mediaRepository;
        this.castRepository = castRepository;
        this.soundtrackRepository = soundtrackRepository;
    }

    @GetMapping("/{id}/xray")
    public ResponseEntity<XRayResponse> getXRayData(@PathVariable String id) {
        Optional<MediaContent> mediaOpt = mediaRepository.findById(id);
        if (mediaOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<CastMember> cast = castRepository.findByMediaId(id);
        List<SoundtrackTrack> soundtrack = soundtrackRepository.findByMediaId(id);

        return ResponseEntity.ok(new XRayResponse(mediaOpt.get(), cast, soundtrack));
    }
}
