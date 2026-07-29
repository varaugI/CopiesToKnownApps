package com.amazon.controller;

import com.amazon.domain.Product;
import com.amazon.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        if (category != null && !category.isEmpty() && !"All Categories".equalsIgnoreCase(category)) {
            return ResponseEntity.ok(productRepository.findByCategory(category));
        }

        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(productRepository.findByTitleContainingIgnoreCase(search));
        }

        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved);
    }
}
