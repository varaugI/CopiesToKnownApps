package com.amazon.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    private String id;

    private String userId;
    private String orderDate;
    private Double totalAmount;
    private String status;

    public Order() {}

    public Order(String id, String userId, String orderDate, Double totalAmount, String status) {
        this.id = id;
        this.userId = userId;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getOrderDate() { return orderDate; }
    public void setOrderDate(String orderDate) { this.orderDate = orderDate; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
