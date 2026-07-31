package com.prime.config;

import com.prime.domain.CastMember;
import com.prime.domain.MediaContent;
import com.prime.domain.SoundtrackTrack;
import com.prime.repository.CastRepository;
import com.prime.repository.MediaRepository;
import com.prime.repository.SoundtrackRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final MediaRepository mediaRepository;
    private final CastRepository castRepository;
    private final SoundtrackRepository soundtrackRepository;

    public DataSeeder(MediaRepository mediaRepository, CastRepository castRepository, SoundtrackRepository soundtrackRepository) {
        this.mediaRepository = mediaRepository;
        this.castRepository = castRepository;
        this.soundtrackRepository = soundtrackRepository;
    }

    @Override
    public void run(String... args) {
        if (mediaRepository.count() > 0) return;

        MediaContent m1 = new MediaContent(
                "hero_1",
                "THE BOYS - SEASON 4",
                "INHERENTLY UNSTABLE. EXTREMELY DANGEROUS.",
                "In Season Four, the world is on the brink. Victoria Neuman is closer than ever to the Oval Office.",
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600",
                "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
                "PRIME ORIGINAL", "18+", "4K UHD", "4 Seasons", "SERIES", true
        );

        MediaContent m2 = new MediaContent(
                "hero_2",
                "FALLOUT",
                "WELCOME TO THE WASTELAND",
                "Based on one of the greatest video game series of all time, Fallout is the story of haves and have-nots in a world in which there's almost nothing left.",
                "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600",
                "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
                "PRIME EXCLUSIVE", "18+", "HDR10+", "1 Season", "SERIES", true
        );

        mediaRepository.saveAll(List.of(m1, m2));

        // Cast Members for The Boys
        CastMember c1 = new CastMember("c1", "hero_1", "Karl Urban", "Billy Butcher");
        CastMember c2 = new CastMember("c2", "hero_1", "Jack Quaid", "Hughie Campbell");
        CastMember c3 = new CastMember("c3", "hero_1", "Antony Starr", "Homelander");

        // Cast Members for Fallout
        CastMember c4 = new CastMember("c4", "hero_2", "Ella Purnell", "Lucy MacLean");
        CastMember c5 = new CastMember("c5", "hero_2", "Walton Goggins", "The Ghoul");

        castRepository.saveAll(List.of(c1, c2, c3, c4, c5));

        // Soundtrack Tracks
        SoundtrackTrack t1 = new SoundtrackTrack("t1", "hero_1", "Pressure", "Billy Joel");
        SoundtrackTrack t2 = new SoundtrackTrack("t2", "hero_2", "I Don't Want to See Tomorrow", "Nat King Cole");

        soundtrackRepository.saveAll(List.of(t1, t2));
    }
}
