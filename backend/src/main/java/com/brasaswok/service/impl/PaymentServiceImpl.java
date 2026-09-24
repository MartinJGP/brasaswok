package com.brasaswok.service.impl;

import com.brasaswok.dto.payment.PaymentRequest;
import com.brasaswok.dto.payment.PaymentResponse;
import com.brasaswok.exception.BadRequestException;
import com.brasaswok.exception.ResourceNotFoundException;
import com.brasaswok.model.Order;
import com.brasaswok.model.Payment;
import com.brasaswok.model.PaymentStatus;
import com.brasaswok.repository.OrderRepository;
import com.brasaswok.repository.PaymentRepository;
import com.brasaswok.security.service.UserDetailsImpl;
import com.brasaswok.service.PaymentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository,
                              OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    // ── GET PAYMENT BY ORDER ──────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(Long orderId, UserDetailsImpl userDetails) {
        // Verificar que el pedido existe y pertenece al usuario (o que es admin)
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !order.getCustomer().getId().equals(userDetails.getId())) {
            // Para el cliente, devolver 404 (no exponer que el pedido existe pero es de otro)
            throw new ResourceNotFoundException("Order not found with id: " + orderId);
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for order id: " + orderId));

        return toPaymentResponse(payment);
    }

    // ── PROCESS PAYMENT ───────────────────────────────────────────────────────────

    @Override
    @Transactional
    public PaymentResponse processPayment(PaymentRequest request, UserDetailsImpl userDetails) {

        // 1. Buscar el pedido
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with id: " + request.getOrderId()));

        // 2. Verificar que el pedido pertenezca al usuario autenticado
        if (!order.getCustomer().getId().equals(userDetails.getId())) {
            throw new ResourceNotFoundException(
                    "Order not found with id: " + request.getOrderId());
        }

        // 3. Buscar el Payment asociado
        Payment payment = paymentRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found for order id: " + request.getOrderId()));

        // 4. Verificar que el pago esté PENDIENTE
        if (payment.getStatus() != PaymentStatus.PENDIENTE) {
            throw new BadRequestException(
                    "Payment is already " + payment.getStatus().name() +
                    " and cannot be processed again");
        }

        // 5. Validar monto — usar compareTo, nunca ==
        if (request.getAmount().compareTo(order.getTotalAmount()) != 0) {
            throw new BadRequestException(
                    "Payment amount " + request.getAmount() +
                    " does not match order total " + order.getTotalAmount());
        }

        // 6. Procesar (confirmación interna simulada)
        payment.setStatus(PaymentStatus.COMPLETADO);
        payment.setPaidAt(LocalDateTime.now());
        payment.setTransactionReference(request.getTransactionReference());

        Payment saved = paymentRepository.save(payment);

        return toPaymentResponse(saved);
    }

    // ── MAPPER ────────────────────────────────────────────────────────────────────

    private PaymentResponse toPaymentResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getPaymentMethod(),
                payment.getStatus(),
                payment.getAmount(),
                payment.getTransactionReference(),
                payment.getPaidAt(),
                payment.getCreatedAt()
        );
    }
}
