package com.youtube.repository;

import com.youtube.domain.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, String> {
    List<Video> findByCategory(String category);
    List<Video> findByTitleContainingIgnoreCase(String title);
    List<Video> findByChannelId(String channelId);
}
