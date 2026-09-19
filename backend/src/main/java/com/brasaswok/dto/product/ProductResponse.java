package com.brasaswok.dto.product;

import java.math.BigDecimal;

public class ProductResponse {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Boolean isAvailable;

    public ProductResponse() {
    }

    public ProductResponse(Long id, Long categoryId, String categoryName, String name, String slug, String description, BigDecimal price, String imageUrl, Boolean isAvailable) {
        this.id = id;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.isAvailable = isAvailable;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean available) {
        isAvailable = available;
    }
}
