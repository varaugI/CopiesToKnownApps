package com.amazon.config;

import com.amazon.domain.Product;
import com.amazon.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return;

        Product p1 = new Product(
                "p1",
                "Apple 2026 MacBook Pro 16-inch M3 Max (36GB Unified Memory, 1TB SSD) - Space Black",
                "Apple", 3499.00, 3899.00, 4.9, 1428, true, "Electronics",
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", true
        );

        Product p2 = new Product(
                "p2",
                "Sony WH-1000XM5 Wireless Industry-Leading Noise Canceling Headphones - Black",
                "Sony", 398.00, 449.99, 4.8, 3890, true, "Electronics",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800", true
        );

        Product p3 = new Product(
                "p3",
                "Amazon Kindle Paperwhite Signature Edition 16 GB - Wireless Charging",
                "Amazon", 189.99, 209.99, 4.7, 8420, true, "Books",
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800", true
        );

        Product p4 = new Product(
                "p4",
                "Logitech MX Master 3S Performance Wireless Mouse with Quiet Clicks",
                "Logitech", 99.99, 119.99, 4.8, 6120, true, "Computers",
                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800", true
        );

        productRepository.saveAll(List.of(p1, p2, p3, p4));
    }
}
