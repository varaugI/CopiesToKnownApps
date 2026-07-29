package com.amazon.controller;

import com.amazon.domain.CartItem;
import com.amazon.domain.Order;
import com.amazon.dto.CheckoutRequest;
import com.amazon.repository.CartRepository;
import com.amazon.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private static final String DEFAULT_USER = "user_me";

    public OrderController(OrderRepository orderRepository, CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrders() {
        return ResponseEntity.ok(orderRepository.findByUserIdOrderByOrderDateDesc(DEFAULT_USER));
    }

    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<Order> checkout(@RequestBody(required = false) CheckoutRequest request) {
        List<CartItem> cartItems = cartRepository.findByUserId(DEFAULT_USER);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        double total = cartItems.stream()
                .mapToDouble(i -> i.getProduct().getPrice() * i.getQuantity())
                .sum();

        Order order = new Order(
                "ord_" + UUID.randomUUID().toString().substring(0, 8),
                DEFAULT_USER,
                LocalDate.now().toString(),
                total,
                "SHIPPED"
        );

        Order saved = orderRepository.save(order);
        cartRepository.deleteByUserId(DEFAULT_USER);

        return ResponseEntity.ok(saved);
    }
}
