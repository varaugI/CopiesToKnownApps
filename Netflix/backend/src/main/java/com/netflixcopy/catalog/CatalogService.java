package com.netflixcopy.catalog;

import org.springframework.stereotype.Service;

import java.util.List;

import static com.netflixcopy.catalog.CatalogModels.CatalogResponse;
import static com.netflixcopy.catalog.CatalogModels.Row;
import static com.netflixcopy.catalog.CatalogModels.Title;

@Service
class CatalogService {

    private static final String IMAGES = "https://images.unsplash.com/";
    private final CatalogResponse catalog;

    CatalogService() {
        var featured = title(
                1,
                "The Last Horizon",
                "N SERIES",
                2026,
                "U/A 16+",
                "1 Season",
                98,
                List.of("Sci-Fi", "Drama", "Thriller"),
                "When the night sky goes silent, an astrophysicist follows one impossible signal to the edge of everything she knows.",
                List.of("Amara Stone", "Theo Bennett", "Mina Rao"),
                "photo-1462331940025-496dfbfc7564",
                "#7783a9",
                null,
                null,
                true,
                "Series"
        );

        var titles = List.of(
                featured,
                title(2, "Blackout", "N FILM", 2025, "U/A 16+", "1h 57m", 96,
                        List.of("Action", "Thriller"),
                        "A city loses power. One courier has until sunrise to deliver the truth that brought the grid down.",
                        List.of("Jules Mercer", "Ari Bell"), "photo-1519608487953-e999c86e7455",
                        "#28364a", 1, 62, false, "Movie"),
                title(3, "Red Notice: Seoul", "N SERIES", 2026, "U/A 13+", "8 Episodes", 94,
                        List.of("Crime", "Drama"),
                        "A meticulous detective and a reckless art thief are forced into an alliance neither can afford.",
                        List.of("Ji-won Park", "Nari Kim", "Daniel Cho"), "photo-1514565131-fce0801e5785",
                        "#892734", 2, null, true, "Series"),
                title(4, "Wild North", "N DOCUMENTARY", 2025, "U/A 7+", "4 Episodes", 97,
                        List.of("Nature", "Documentary"),
                        "Across ice, forest and open ocean, remarkable animals make a home at the top of the world.",
                        List.of("Narrated by Mara Evans"), "photo-1464278533981-50106e6176b1",
                        "#4c797c", null, 27, false, "Series"),
                title(5, "Afterlight", "N FILM", 2026, "U/A 16+", "2h 9m", 93,
                        List.of("Mystery", "Drama"),
                        "A photographer discovers that every picture she takes at dusk reveals a moment from the following day.",
                        List.of("Lena Ortiz", "Samir Das"), "photo-1500534314209-a25ddb2bd429",
                        "#b15c3f", 5, null, false, "Movie"),
                title(6, "Midnight Diner", "N SERIES", 2024, "U/A 13+", "3 Seasons", 91,
                        List.of("Drama", "Food"),
                        "A tiny restaurant opens after midnight, serving comfort food and second chances to the people of the city.",
                        List.of("Ken Watan", "Aya Mori"), "photo-1515003197210-e0cd71810b5f",
                        "#8e5a38", null, 81, false, "Series"),
                title(7, "Limitless", "N SPORTS", 2026, "U/A 7+", "6 Episodes", 95,
                        List.of("Sports", "Documentary"),
                        "Six athletes. Six impossible goals. One season that tests the line between discipline and obsession.",
                        List.of("Elena Cole", "Mateo Ruiz"), "photo-1517836357463-d25dfeac3438",
                        "#bd6428", 3, null, false, "Series"),
                title(8, "The Good Thief", "N FILM", 2025, "U/A 16+", "1h 48m", 89,
                        List.of("Crime", "Comedy"),
                        "A principled thief plans one final job, only to discover the mark is the person who taught him everything.",
                        List.of("Nico Hale", "David Osei"), "photo-1440404653325-ab127d49abc1",
                        "#875a34", 7, null, false, "Movie"),
                title(9, "Deep Blue", "N DOCUMENTARY", 2025, "U", "5 Episodes", 99,
                        List.of("Nature", "Documentary"),
                        "New imaging technology reveals the hidden societies thriving in the least explored corners of our oceans.",
                        List.of("Narrated by Anika Shah"), "photo-1469474968028-56623f02e42e",
                        "#245d76", 4, null, false, "Series"),
                title(10, "Neon City", "N SERIES", 2026, "A", "10 Episodes", 92,
                        List.of("Sci-Fi", "Crime"),
                        "In a sleepless megacity, a memory broker takes a case that leads straight back to her erased past.",
                        List.of("Iris Chen", "Noah Vale"), "photo-1519608487953-e999c86e7455",
                        "#6b326f", 6, null, false, "Series"),
                title(11, "Home Ground", "N FILM", 2024, "U/A 13+", "2h 2m", 87,
                        List.of("Drama", "Sports"),
                        "A retired football captain returns to the neighborhood that made her to save its last public field.",
                        List.of("Rhea Kapoor", "Imani Brooks"), "photo-1579952363873-27f3bade9f55",
                        "#3d713f", null, 44, false, "Movie"),
                title(12, "Paper Kingdom", "N SERIES", 2025, "U/A 13+", "2 Seasons", 90,
                        List.of("Fantasy", "Drama"),
                        "Three siblings inherit a bookshop where every unfinished story opens a door to another world.",
                        List.of("Maya Finn", "Eli North", "June Vale"), "photo-1519681393784-d120267933ba",
                        "#655486", 8, null, false, "Series")
        );

        var rows = List.of(
                new Row("continue", "Continue Watching for Gaurav", List.of(2L, 4L, 6L, 11L)),
                new Row("top-ten", "Top 10 in India Today", List.of(2L, 3L, 7L, 9L, 5L, 10L, 8L, 12L)),
                new Row("trending", "Trending Now", List.of(3L, 7L, 10L, 5L, 2L, 12L)),
                new Row("only", "Only on Netflix", List.of(1L, 4L, 9L, 6L, 3L, 12L)),
                new Row("binge", "Binge-worthy TV Shows", List.of(10L, 3L, 6L, 1L, 12L, 7L))
        );
        catalog = new CatalogResponse(featured, rows, titles);
    }

    CatalogResponse getCatalog() {
        return catalog;
    }

    private static Title title(
            long id,
            String name,
            String eyebrow,
            int year,
            String maturity,
            String duration,
            int match,
            List<String> genres,
            String synopsis,
            List<String> cast,
            String imageId,
            String accent,
            Integer rank,
            Integer progress,
            boolean isNew,
            String type
    ) {
        String landscape = IMAGES + imageId + "?auto=format&fit=crop&w=900&q=86";
        String backdrop = IMAGES + imageId + "?auto=format&fit=crop&w=1800&q=86";
        return new Title(
                id, name, eyebrow, year, maturity, duration, match, genres, synopsis, cast,
                landscape, backdrop, accent, rank, progress, isNew, type
        );
    }
}
