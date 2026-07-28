package com.youtube.config;

import com.youtube.domain.Channel;
import com.youtube.domain.Comment;
import com.youtube.domain.Playlist;
import com.youtube.domain.Video;
import com.youtube.repository.ChannelRepository;
import com.youtube.repository.CommentRepository;
import com.youtube.repository.PlaylistRepository;
import com.youtube.repository.VideoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final VideoRepository videoRepository;
    private final ChannelRepository channelRepository;
    private final CommentRepository commentRepository;
    private final PlaylistRepository playlistRepository;

    public DataSeeder(VideoRepository videoRepository, ChannelRepository channelRepository,
                      CommentRepository commentRepository, PlaylistRepository playlistRepository) {
        this.videoRepository = videoRepository;
        this.channelRepository = channelRepository;
        this.commentRepository = commentRepository;
        this.playlistRepository = playlistRepository;
    }

    @Override
    public void run(String... args) {
        if (videoRepository.count() > 0) return;

        // Seed Channels
        Channel cyberCode = new Channel(
                "ch_cyber", "Cyber Code Studio", "@cybercodestudio",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
                "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200",
                428000L, true, true
        );

        Channel synthPulse = new Channel(
                "ch_lofi", "Synthwave Pulse ⚡", "@synthwavepulse",
                "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200",
                "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
                1240000L, true, false
        );

        channelRepository.saveAll(List.of(cyberCode, synthPulse));

        // Seed Videos
        Video v1 = new Video(
                "yt_1",
                "Full-Stack Web Development Course 2026 - Build 5 Modern React Applications!",
                "Learn modern Web Development with React 19, Vite, custom CSS design systems, and Spring Boot Java backends.",
                "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
                "48:15", 384200L, 24100L, 120L, "Coding", "2 days ago",
                "rgba(0, 150, 255, 0.35)", false, cyberCode
        );

        Video v2 = new Video(
                "yt_2",
                "Late Night Synthwave Lo-Fi Beats 🎧 Chill Beats to Code / Relax / Study To",
                "Continuous synthwave beats for coding productivity and midnight relaxation.",
                "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-playing-on-a-computer-keyboard-41474-large.mp4",
                "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
                "3:42:10", 1890000L, 142000L, 310L, "Music", "1 week ago",
                "rgba(255, 0, 128, 0.35)", false, synthPulse
        );

        videoRepository.saveAll(List.of(v1, v2));

        // Seed Comments
        Comment c1 = new Comment(
                "c1", "yt_1", "Sarah Jenkins",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
                "This is hands down the best React + Spring Boot tutorial on YouTube! 🙌🔥",
                "1 day ago", 412L, true, false, true
        );

        commentRepository.save(c1);

        // Seed Playlists
        Playlist p1 = new Playlist("pl_1", "Watch Later", true, 4, "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400");
        Playlist p2 = new Playlist("pl_2", "Web Development 2026", false, 8, "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400");

        playlistRepository.saveAll(List.of(p1, p2));
    }
}
