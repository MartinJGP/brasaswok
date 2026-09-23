package com.brasaswok.controller;

import com.brasaswok.dto.payment.PaymentRequest;
import com.brasaswok.dto.payment.PaymentResponse;
import com.brasaswok.model.PaymentMethod;
import com.brasaswok.model.PaymentStatus;
import com.brasaswok.model.Role;
import com.brasaswok.model.User;
import com.brasaswok.security.jwt.JwtAuthenticationEntryPoint;
import com.brasaswok.security.jwt.JwtAuthenticationFilter;
import com.brasaswok.security.jwt.JwtUtils;
import com.brasaswok.security.service.UserDetailsImpl;
import com.brasaswok.security.service.UserDetailsServiceImpl;
import com.brasaswok.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.brasaswok.config.SecurityConfig;
import org.springframework.context.annotation.Import;

@WebMvcTest(PaymentController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, JwtAuthenticationEntryPoint.class})
class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();




    @MockitoBean
    private PaymentService paymentService;

    // Beans requeridos por SecurityConfig en el contexto @WebMvcTest
    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;
    @MockitoBean
    private JwtUtils jwtUtils;

    private PaymentResponse pendingPaymentResponse;
    private PaymentResponse completedPaymentResponse;
    private UserDetailsImpl customerDetails;

    @BeforeEach
    void setUp() {
        User customer = new User("cliente", "cliente@test.com", "pass",
                "Cliente Test", "999000001", "Av. Lima 123", Role.ROLE_CUSTOMER);
        customer.setId(1L);
        customerDetails = UserDetailsImpl.build(customer);

        pendingPaymentResponse = new PaymentResponse(
                1L, 10L, PaymentMethod.TRANSFERENCIA, PaymentStatus.PENDIENTE,
                new BigDecimal("70.00"), null, null, LocalDateTime.now()
        );

        completedPaymentResponse = new PaymentResponse(
                1L, 10L, PaymentMethod.TRANSFERENCIA, PaymentStatus.COMPLETADO,
                new BigDecimal("70.00"), "REF-ABC123", LocalDateTime.now(), LocalDateTime.now()
        );
    }

    // ── GET PAYMENT ───────────────────────────────────────────────────────────────

    @Test
    void getPayment_shouldReturn200_whenAuthenticated() throws Exception {
        when(paymentService.getPaymentByOrderId(anyLong(), any())).thenReturn(pendingPaymentResponse);

        mockMvc.perform(get("/api/payments/order/10")
                        .with(user(customerDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(10))
                .andExpect(jsonPath("$.status").value("PENDIENTE"))
                .andExpect(jsonPath("$.amount").value(70.00));
    }

    @Test
    void getPayment_shouldReturn401_whenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/payments/order/10"))
                .andExpect(status().isUnauthorized());
    }

    // ── PROCESS PAYMENT ───────────────────────────────────────────────────────────

    @Test
    void processPayment_shouldReturn200_whenValid() throws Exception {
        when(paymentService.processPayment(any(), any())).thenReturn(completedPaymentResponse);

        PaymentRequest request = new PaymentRequest(
                10L, PaymentMethod.TRANSFERENCIA, new BigDecimal("70.00"), "REF-ABC123");

        mockMvc.perform(post("/api/payments/process")
                        .with(user(customerDetails))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETADO"))
                .andExpect(jsonPath("$.transactionReference").value("REF-ABC123"))
                .andExpect(jsonPath("$.paidAt").isNotEmpty());
    }

    @Test
    void processPayment_shouldReturn401_whenNotAuthenticated() throws Exception {
        PaymentRequest request = new PaymentRequest(
                10L, PaymentMethod.EFECTIVO, new BigDecimal("70.00"), null);

        mockMvc.perform(post("/api/payments/process")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void processPayment_shouldReturn400_whenRequestInvalid() throws Exception {
        // orderId null → @NotNull debe fallar con 400
        PaymentRequest invalidRequest = new PaymentRequest(
                null, null, null, null);

        mockMvc.perform(post("/api/payments/process")
                        .with(user(customerDetails))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}
