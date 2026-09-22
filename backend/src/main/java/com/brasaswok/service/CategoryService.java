package com.brasaswok.service;

import com.brasaswok.dto.product.CategoryRequest;
import com.brasaswok.dto.product.CategoryResponse;
import com.brasaswok.exception.BadRequestException;
import com.brasaswok.exception.ResourceNotFoundException;
import com.brasaswok.model.Category;
import com.brasaswok.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        return toResponse(findCategoryOrThrow(id));
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Ya existe una categoría con el slug '" + request.getSlug() + "'");
        }

        Category category = new Category(
                request.getName(),
                request.getSlug(),
                request.getDescription(),
                request.getImageUrl(),
                request.getDisplayOrder(),
                request.getIsActive()
        );

        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = findCategoryOrThrow(id);

        if (!category.getSlug().equals(request.getSlug()) && categoryRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Ya existe una categoría con el slug '" + request.getSlug() + "'");
        }

        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        category.setDisplayOrder(request.getDisplayOrder());
        category.setIsActive(request.getIsActive());

        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse toggleStatus(Long id) {
        Category category = findCategoryOrThrow(id);
        category.setIsActive(!Boolean.TRUE.equals(category.getIsActive()));
        return toResponse(categoryRepository.save(category));
    }

    private Category findCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con id: " + id));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getImageUrl(),
                category.getDisplayOrder(),
                category.getIsActive()
        );
    }
}