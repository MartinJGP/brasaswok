package com.brasaswok.service.impl;

import com.brasaswok.dto.payment.PaymentRequest;
import com.brasaswok.dto.payment.PaymentResponse;
import com.brasaswok.exception.BadRequestException;
import com.brasaswok.exception.ResourceNotFoundException;
import com.brasaswok.model.Order;
import com.brasaswok.model.Payment;
import com.brasaswok.model.PaymentMethod;
import com.brasaswok.model.PaymentStatus;
import com.brasaswok.model.Role;
import com.brasaswok.model.User;
import com.brasaswok.repository.OrderRepository;
import com.brasaswok.repository.PaymentRepository;
import com.brasaswok.security.service.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;
    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private PaymentServiceImpl paymentService;

    private User customer;
    private Order order;
    private Payment payment;
    private UserDetailsImpl customerDetails;

    @BeforeEach
    void setUp() {
        customer = new User("cliente", "cliente@test.com", "pass", "Cliente Test",
                "999000001", "Av. Lima 123", Role.ROLE_CUSTOMER);
        customer.setId(1L);

        order = new Order("BW-100001", customer, PaymentMethod.TRANSFERENCIA,
                "Av. Lima 1", "991111111", null,
                new BigDecimal("70.00"), BigDecimal.ZERO, new BigDecimal("70.00"));
        order.setId(10L);
        order.setCreatedAt(LocalDateTime.now());
        order.setItems(new ArrayList<>());
        order.setStatusLogs(new ArrayList<>());

        payment = new Payment(order, PaymentMethod.TRANSFERENCIA, new BigDecimal("70.00"), null);
        payment.setId(1L);
        payment.setCreatedAt(LocalDateTime.now());
        order.setPayment(payment);

        customerDetails = UserDetailsImpl.build(customer);
    }

    // ── GET PAYMENT ───────────────────────────────────────────────────────────────

    @Test
    void getPayment_shouldReturnPayment_forOwner() {
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(10L)).thenReturn(Optional.of(payment));

        PaymentResponse response = paymentService.getPaymentByOrderId(10L, customerDetails);

        assertThat(response).isNotNull();
        assertThat(response.getOrderId()).isEqualTo(10L);
        assertThat(response.getStatus()).isEqualTo(PaymentStatus.PENDIENTE);
        assertThat(response.getAmount()).isEqualByComparingTo(new BigDecimal("70.00"));
    }

    @Test
    void getPayment_shouldThrow_whenOrderBelongsToAnotherCustomer() {
        User otherCustomer = new User("otro", "otro@test.com", "pass", "Otro",
                "000", "addr", Role.ROLE_CUSTOMER);
        otherCustomer.setId(99L);
        Order otherOrder = new Order("BW-999", otherCustomer, PaymentMethod.EFECTIVO,
                "addr", "000", null,
                BigDecimal.TEN, BigDecimal.ZERO, BigDecimal.TEN);
        otherOrder.setId(20L);
        otherOrder.setCreatedAt(LocalDateTime.now());
        otherOrder.setItems(new ArrayList<>());
        otherOrder.setStatusLogs(new ArrayList<>());

        when(orderRepository.findById(20L)).thenReturn(Optional.of(otherOrder));

        // customer (id=1) intenta ver el pago de otherOrder (owner id=99)
        assertThatThrownBy(() -> paymentService.getPaymentByOrderId(20L, customerDetails))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Order not found");
    }

    // ── PROCESS PAYMENT ───────────────────────────────────────────────────────────

    @Test
    void processPayment_shouldComplete_whenValid() {
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(10L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentRequest request = new PaymentRequest(
                10L, PaymentMethod.TRANSFERENCIA, new BigDecimal("70.00"), "REF-ABC123");

        PaymentResponse response = paymentService.processPayment(request, customerDetails);

        assertThat(response.getStatus()).isEqualTo(PaymentStatus.COMPLETADO);
        assertThat(response.getTransactionReference()).isEqualTo("REF-ABC123");
        assertThat(response.getPaidAt()).isNotNull();
    }

    @Test
    void processPayment_shouldThrow_whenAmountIsIncorrect() {
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(10L)).thenReturn(Optional.of(payment));

        // Monto incorrecto: 50 != 70
        PaymentRequest request = new PaymentRequest(
                10L, PaymentMethod.TRANSFERENCIA, new BigDecimal("50.00"), null);

        assertThatThrownBy(() -> paymentService.processPayment(request, customerDetails))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("does not match");
    }

    @Test
    void processPayment_shouldThrow_whenAlreadyCompleted() {
        payment.setStatus(PaymentStatus.COMPLETADO);
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(10L)).thenReturn(Optional.of(payment));

        PaymentRequest request = new PaymentRequest(
                10L, PaymentMethod.TRANSFERENCIA, new BigDecimal("70.00"), null);

        assertThatThrownBy(() -> paymentService.processPayment(request, customerDetails))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("COMPLETADO");
    }

    @Test
    void processPayment_shouldSetPaidAt() {
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(10L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentRequest request = new PaymentRequest(
                10L, PaymentMethod.TRANSFERENCIA, new BigDecimal("70.00"), "REF-001");

        PaymentResponse response = paymentService.processPayment(request, customerDetails);

        assertThat(response.getPaidAt()).isNotNull();
        assertThat(response.getPaidAt()).isBeforeOrEqualTo(LocalDateTime.now());
    }

    @Test
    void processPayment_shouldSaveTransactionReference() {
        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(10L)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));

        PaymentRequest request = new PaymentRequest(
                10L, PaymentMethod.TRANSFERENCIA, new BigDecimal("70.00"), "TXN-XYZ789");

        PaymentResponse response = paymentService.processPayment(request, customerDetails);

        assertThat(response.getTransactionReference()).isEqualTo("TXN-XYZ789");
    }

    @Test
    void processPayment_shouldThrow_whenOrderNotOwned() {
        User otherCustomer = new User("otro", "otro@test.com", "pass", "Otro",
                "000", "addr", Role.ROLE_CUSTOMER);
        otherCustomer.setId(99L);
        Order otherOrder = new Order("BW-999", otherCustomer, PaymentMethod.EFECTIVO,
                "addr", "000", null,
                BigDecimal.TEN, BigDecimal.ZERO, BigDecimal.TEN);
        otherOrder.setId(20L);
        otherOrder.setCreatedAt(LocalDateTime.now());
        otherOrder.setItems(new ArrayList<>());
        otherOrder.setStatusLogs(new ArrayList<>());

        when(orderRepository.findById(20L)).thenReturn(Optional.of(otherOrder));

        PaymentRequest request = new PaymentRequest(
                20L, PaymentMethod.EFECTIVO, BigDecimal.TEN, null);

        assertThatThrownBy(() -> paymentService.processPayment(request, customerDetails))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Order not found");
    }
}
