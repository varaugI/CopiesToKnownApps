package com.amazon.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    private String id;

    @Column(nullable = false, length = 500)
    private String title;

    private String brand;
    private Double price;
    private Double originalPrice;
    private Double rating;
    private Integer reviewsCount;
    private Boolean isPrime;
    private String category;

    @Column(length = 1000)
    private String image;

    private Boolean inStock;

    public Product() {}

    public Product(String id, String title, String brand, Double price, Double originalPrice,
                   Double rating, Integer reviewsCount, Boolean isPrime, String category,
                   String image, Boolean inStock) {
        this.id = id;
        this.title = title;
        this.brand = brand;
        this.price = price;
        this.originalPrice = originalPrice;
        this.rating = rating;
        this.reviewsCount = reviewsCount;
        this.isPrime = isPrime;
        this.category = category;
        this.image = image;
        this.inStock = inStock;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }

    public Boolean getIsPrime() { return isPrime; }
    public void setIsPrime(Boolean isPrime) { this.isPrime = isPrime; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }
}
