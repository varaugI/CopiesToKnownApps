package com.streamflix.modules.catalog.repository;

import com.streamflix.modules.catalog.domain.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre, String> {
    Optional<Genre> findBySlug(String slug);
}
