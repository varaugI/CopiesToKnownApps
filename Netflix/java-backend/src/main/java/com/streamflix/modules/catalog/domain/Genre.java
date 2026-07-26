package com.streamflix.modules.catalog.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "genres")
public class Genre {

    @Id
    private String id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    public Genre() {
        this.id = UUID.randomUUID().toString();
    }

    public Genre(String name, String slug) {
        this();
        this.name = name;
        this.slug = slug;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
}
