package com.brasaswok.repository;

import com.brasaswok.model.Order;
import com.brasaswok.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Busca los pedidos de un cliente por su ID, ordenados por fecha de creación desc.
     */
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);

    /**
     * Lista todos los pedidos ordenados por fecha de creación desc.
     */
    List<Order> findAllByOrderByCreatedAtDesc();

    /**
     * Filtra pedidos por estado, ordenados por fecha de creación desc.
     */
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    /**
     * Busca un pedido por ID y cliente (evita exponer pedidos de otros usuarios).
     */
    Optional<Order> findByIdAndCustomerId(Long id, Long customerId);

    /**
     * Verifica si ya existe un número de pedido (para evitar duplicados).
     */
    boolean existsByOrderNumber(String orderNumber);

    /**
     * Cuenta el total de pedidos (usado como fallback para numeración legible).
     */
    @Query("SELECT COUNT(o) FROM Order o")
    long countAll();
}
