package com.streamflix.service;

import com.streamflix.model.Movie;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final String sampleCyberpunk = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";
    private final String sampleSpace = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4";
    private final String sampleNature = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

    private final List<Movie> movies = Arrays.asList(
        new Movie(
            "m1", "Cyber Chronicles: 2099", "Series", "3 Seasons", 98, 2024,
            "18+", "4K Ultra HD", "45m per ep",
            "In a dystopian mega-city ruled by ruthless AI syndicates, a rogue netrunner discovers a secret neural artifact that could rewrite human consciousness forever.",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
            sampleCyberpunk, sampleCyberpunk,
            Arrays.asList("Trending Now", "Sci-Fi Blockbusters", "Top 10 Today"), 1,
            Arrays.asList("Sci-Fi", "Cyberpunk", "Action"),
            Arrays.asList("Elena Rostova", "Marcus Vance"), "Denis Villeneuve"
        ),
        new Movie(
            "m2", "The Eclipse Protocol", "Movie", null, 96, 2025,
            "16+", "HDR10+", "2h 18m",
            "When a solar observatory detects an artificial shadow enveloping Jupiter, a team of elite astronauts embarks on a silent reconnaissance mission.",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80",
            sampleSpace, sampleSpace,
            Arrays.asList("Trending Now", "Sci-Fi Blockbusters"), 2,
            Arrays.asList("Space Sci-Fi", "Suspense"),
            Arrays.asList("Sarah Jenkins", "David Oyelowo"), "Christopher Nolan"
        ),
        new Movie(
            "m3", "Crown of Wildlands", "Series", "4 Seasons", 94, 2024,
            "16+", "4K Ultra HD", "1h 02m per ep",
            "Four warring feudal clans compete for ancient runes that control the seasonal elemental balance.",
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
            sampleNature, sampleNature,
            Arrays.asList("Popular Movies", "Top 10 Today"), 3,
            Arrays.asList("Fantasy", "Adventure"),
            Arrays.asList("Alexander Skarsgård", "Freya Allan"), "Peter Jackson"
        )
    );

    public List<Movie> getAllMovies(String category, String genre, String type) {
        return movies.stream().filter(m -> {
            boolean matchType = (type == null) || m.getType().equalsIgnoreCase(type);
            boolean matchCat = (category == null) || (m.getCategories() != null && m.getCategories().contains(category));
            boolean matchGenre = (genre == null || genre.equals("All")) || (m.getGenres() != null && m.getGenres().contains(genre));
            return matchType && matchCat && matchGenre;
        }).collect(Collectors.toList());
    }

    public Movie getBillboard() {
        return movies.get(0);
    }

    public Optional<Movie> getMovieById(String id) {
        return movies.stream().filter(m -> m.getId().equals(id)).findFirst();
    }

    public List<Movie> searchMovies(String query) {
        if (query == null || query.trim().isEmpty()) return Arrays.asList();
        String q = query.toLowerCase();
        return movies.stream().filter(m ->
            m.getTitle().toLowerCase().contains(q) ||
            (m.getGenres() != null && m.getGenres().stream().anyMatch(g -> g.toLowerCase().contains(q))) ||
            (m.getCast() != null && m.getCast().stream().anyMatch(c -> c.toLowerCase().contains(q)))
        ).collect(Collectors.toList());
    }

    public List<String> getCategories() {
        return Arrays.asList("Trending Now", "Top 10 Today", "Sci-Fi Blockbusters", "Popular Movies");
    }
}
