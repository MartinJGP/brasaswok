package com.brasaswok.repository;

import com.brasaswok.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByIsAvailableTrue();

    List<Product> findByCategoryIdAndIsAvailableTrue(Long categoryId);

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
