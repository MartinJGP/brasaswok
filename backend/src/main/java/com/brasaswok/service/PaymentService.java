package com.brasaswok.service;

import com.brasaswok.dto.payment.PaymentRequest;
import com.brasaswok.dto.payment.PaymentResponse;
import com.brasaswok.security.service.UserDetailsImpl;

public interface PaymentService {

    /**
     * Devuelve el pago asociado a una orden.
     * Verifica que el pedido pertenezca al usuario autenticado (o que sea admin).
     */
    PaymentResponse getPaymentByOrderId(Long orderId, UserDetailsImpl userDetails);

    /**
     * Procesa (confirma internamente) el pago PENDIENTE de un pedido.
     * Valida monto, verifica estado PENDIENTE y registra transactionReference + paidAt.
     */
    PaymentResponse processPayment(PaymentRequest request, UserDetailsImpl userDetails);
}
