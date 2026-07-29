package com.amazon.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AddToCartRequest {

    @NotBlank(message = "ProductId is required")
    private String productId;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
