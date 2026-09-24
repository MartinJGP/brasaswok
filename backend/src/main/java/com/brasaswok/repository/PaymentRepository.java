package com.brasaswok.repository;

import com.brasaswok.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Consulta el pago asociado a una orden.
     */
    Optional<Payment> findByOrderId(Long orderId);
}
