package com.brasaswok.controller;

import com.brasaswok.dto.order.OrderCreateRequest;
import com.brasaswok.dto.order.OrderItemRequest;
import com.brasaswok.dto.order.OrderItemResponse;
import com.brasaswok.dto.order.OrderResponse;
import com.brasaswok.dto.order.OrderStatusLogResponse;
import com.brasaswok.model.OrderStatus;
import com.brasaswok.model.PaymentMethod;
import com.brasaswok.model.Role;
import com.brasaswok.model.User;
import com.brasaswok.security.jwt.JwtAuthenticationEntryPoint;
import com.brasaswok.security.jwt.JwtAuthenticationFilter;
import com.brasaswok.security.jwt.JwtUtils;
import com.brasaswok.security.service.UserDetailsImpl;
import com.brasaswok.security.service.UserDetailsServiceImpl;
import com.brasaswok.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.brasaswok.config.SecurityConfig;
import org.springframework.context.annotation.Import;

@WebMvcTest(OrderController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, JwtAuthenticationEntryPoint.class, OrderControllerTest.TestSecurityExceptionHandler.class})
class OrderControllerTest {

    @org.springframework.boot.test.context.TestConfiguration
    static class TestSecurityExceptionHandler {
        @org.springframework.web.bind.annotation.RestControllerAdvice
        @org.springframework.core.annotation.Order(org.springframework.core.Ordered.HIGHEST_PRECEDENCE)
        static class AccessDeniedHandler {
            @org.springframework.web.bind.annotation.ExceptionHandler(org.springframework.security.authorization.AuthorizationDeniedException.class)
            public org.springframework.http.ResponseEntity<Void> handleAuthDenied() {
                return org.springframework.http.ResponseEntity.status(403).build();
            }
        }
    }

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();




    @MockitoBean
    private OrderService orderService;

    // Beans requeridos por SecurityConfig en el contexto @WebMvcTest
    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;
    @MockitoBean
    private JwtUtils jwtUtils;

    private OrderResponse sampleOrderResponse;
    private UserDetailsImpl customerDetails;

    @BeforeEach
    void setUp() {
        User customer = new User("cliente", "cliente@test.com", "pass",
                "Cliente Test", "999000001", "Av. Lima 123", Role.ROLE_CUSTOMER);
        customer.setId(1L);
        customerDetails = UserDetailsImpl.build(customer);

        sampleOrderResponse = new OrderResponse(
                1L, "BW-100001", 1L, "Cliente Test", "999000001",
                OrderStatus.PENDIENTE, PaymentMethod.TRANSFERENCIA,
                "Av. Benavides 1940", "991234567", null,
                new BigDecimal("35.00"), BigDecimal.ZERO, new BigDecimal("35.00"),
                45, LocalDateTime.now(), null,
                List.of(new OrderItemResponse(1L, 1L, "Pollo", 1,
                        new BigDecimal("35.00"), new BigDecimal("35.00"), null)),
                List.of(new OrderStatusLogResponse(1L, null, OrderStatus.PENDIENTE,
                        "cliente", "Pedido creado", LocalDateTime.now()))
        );
    }

    // ── SECURITY TESTS ────────────────────────────────────────────────────────────

    @Test
    void createOrder_shouldReturn401_whenNotAuthenticated() throws Exception {
        OrderCreateRequest request = new OrderCreateRequest(
                "Av. Lima 1", "991111111", null, PaymentMethod.EFECTIVO,
                List.of(new OrderItemRequest(1L, 1, null))
        );
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createOrder_shouldReturn403_whenAdmin() throws Exception {
        OrderCreateRequest request = new OrderCreateRequest(
                "Av. Lima 1", "991111111", null, PaymentMethod.EFECTIVO,
                List.of(new OrderItemRequest(1L, 1, null))
        );
        mockMvc.perform(post("/api/orders")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void createOrder_shouldReturn201_whenCustomer() throws Exception {
        when(orderService.createOrder(any(), any())).thenReturn(sampleOrderResponse);

        OrderCreateRequest request = new OrderCreateRequest(
                "Av. Benavides 1940", "991234567", null, PaymentMethod.TRANSFERENCIA,
                List.of(new OrderItemRequest(1L, 1, null))
        );

        mockMvc.perform(post("/api/orders")
                        .with(user(customerDetails))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderNumber").value("BW-100001"))
                .andExpect(jsonPath("$.status").value("PENDIENTE"))
                .andExpect(jsonPath("$.customerId").value(1));
    }

    @Test
    void getMyOrders_shouldReturn200_whenCustomer() throws Exception {
        when(orderService.getMyOrders(any())).thenReturn(List.of(sampleOrderResponse));

        mockMvc.perform(get("/api/orders/my-orders")
                        .with(user(customerDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].customerId").value(1));
    }

    @Test
    void getMyOrders_shouldReturn401_whenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/orders/my-orders"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getOrderById_shouldReturn200_whenCustomerOwnsOrder() throws Exception {
        when(orderService.getOrderById(any(), any())).thenReturn(sampleOrderResponse);

        mockMvc.perform(get("/api/orders/1")
                        .with(user(customerDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }
}
