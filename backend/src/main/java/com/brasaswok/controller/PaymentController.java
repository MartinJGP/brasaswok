package com.brasaswok.controller;

import com.brasaswok.dto.payment.PaymentRequest;
import com.brasaswok.dto.payment.PaymentResponse;
import com.brasaswok.security.service.UserDetailsImpl;
import com.brasaswok.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /**
     * GET /api/payments/order/{orderId}
     * Devuelve el pago de un pedido. El cliente solo puede ver el pago de sus propios pedidos.
     */
    @GetMapping("/order/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId, userDetails));
    }

    /**
     * POST /api/payments/process
     * Procesa (confirma internamente) el pago PENDIENTE de un pedido.
     * Solo el propietario del pedido puede procesar el pago.
     */
    @PostMapping("/process")
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    public ResponseEntity<PaymentResponse> processPayment(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(paymentService.processPayment(request, userDetails));
    }
}
