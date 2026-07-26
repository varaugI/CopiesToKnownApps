package com.streamflix.controller;

import com.streamflix.model.Movie;
import com.streamflix.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/movies")
    public List<Movie> getMovies(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String type) {
        return movieService.getAllMovies(category, genre, type);
    }

    @GetMapping("/movies/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable String id) {
        return movieService.getMovieById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/billboard")
    public Movie getBillboard() {
        return movieService.getBillboard();
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        return movieService.getCategories();
    }

    @GetMapping("/search")
    public List<Movie> search(@RequestParam(required = false) String q) {
        return movieService.searchMovies(q);
    }
}
