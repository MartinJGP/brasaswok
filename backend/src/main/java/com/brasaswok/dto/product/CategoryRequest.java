package com.brasaswok.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 60, message = "Category name must not exceed 60 characters")
    private String name;

    @NotBlank(message = "Slug is required")
    @Size(max = 60, message = "Slug must not exceed 60 characters")
    private String slug;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    private String imageUrl;

    private Integer displayOrder = 0;

    private Boolean isActive = true;

    public CategoryRequest() {
    }

    public CategoryRequest(String name, String slug, String description, String imageUrl, Integer displayOrder, Boolean isActive) {
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder != null ? displayOrder : 0;
        this.isActive = isActive != null ? isActive : true;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }
}
