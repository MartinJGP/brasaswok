package com.brasaswok.repository;

import com.brasaswok.model.OrderStatusLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderStatusLogRepository extends JpaRepository<OrderStatusLog, Long> {

    /**
     * Recupera los logs de una orden ordenados cronológicamente (ascendente).
     */
    List<OrderStatusLog> findByOrderIdOrderByCreatedAtAsc(Long orderId);
}
