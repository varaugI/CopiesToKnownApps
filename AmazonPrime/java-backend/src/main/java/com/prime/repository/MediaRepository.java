package com.prime.repository;

import com.prime.domain.MediaContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<MediaContent, String> {
    List<MediaContent> findByContentType(String contentType);
    List<MediaContent> findByIsOriginalTrue();
    List<MediaContent> findByTitleContainingIgnoreCase(String title);
}
