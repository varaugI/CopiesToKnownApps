package com.amazon.controller;

import com.amazon.domain.CartItem;
import com.amazon.domain.Product;
import com.amazon.dto.AddToCartRequest;
import com.amazon.repository.CartRepository;
import com.amazon.repository.ProductRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private static final String DEFAULT_USER = "user_me";

    public CartController(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart() {
        return ResponseEntity.ok(cartRepository.findByUserId(DEFAULT_USER));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@Valid @RequestBody AddToCartRequest request) {
        Optional<Product> productOpt = productRepository.findById(request.getProductId());
        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = productOpt.get();
        Optional<CartItem> existingOpt = cartRepository.findByUserIdAndProductId(DEFAULT_USER, request.getProductId());

        CartItem item;
        if (existingOpt.isPresent()) {
            item = existingOpt.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            item = new CartItem("cart_" + UUID.randomUUID().toString().substring(0, 8), DEFAULT_USER, product, request.getQuantity());
        }

        return ResponseEntity.ok(cartRepository.save(item));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable String productId) {
        Optional<CartItem> existing = cartRepository.findByUserIdAndProductId(DEFAULT_USER, productId);
        if (existing.isPresent()) {
            cartRepository.delete(existing.get());
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
