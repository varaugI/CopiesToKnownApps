package com.streamflix.modules.catalog.dto;

import com.streamflix.modules.catalog.domain.Genre;

public class GenreDto {
    private String id;
    private String name;
    private String slug;

    public GenreDto() {}

    public GenreDto(Genre genre) {
        this.id = genre.getId();
        this.name = genre.getName();
        this.slug = genre.getSlug();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
}
