package com.brasaswok.repository;

import com.brasaswok.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // findById(Long id) heredado de JpaRepository es suficiente para
    // validar existencia, disponibilidad y obtener el precio real.
}
