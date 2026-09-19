package com.brasaswok.dto.product;

public class CategoryResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private Integer displayOrder;
    private Boolean isActive;

    public CategoryResponse() {
    }

    public CategoryResponse(Long id, String name, String slug, String description, String imageUrl, Integer displayOrder, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
        this.isActive = isActive;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
