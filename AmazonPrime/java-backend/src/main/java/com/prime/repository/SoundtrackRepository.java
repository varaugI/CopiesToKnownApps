package com.prime.repository;

import com.prime.domain.SoundtrackTrack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoundtrackRepository extends JpaRepository<SoundtrackTrack, String> {
    List<SoundtrackTrack> findByMediaId(String mediaId);
}
