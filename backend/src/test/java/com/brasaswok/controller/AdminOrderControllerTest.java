package com.brasaswok.controller;

import com.brasaswok.dto.order.OrderResponse;
import com.brasaswok.dto.order.OrderStatusLogResponse;
import com.brasaswok.dto.order.OrderStatusUpdateRequest;
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
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.brasaswok.config.SecurityConfig;
import org.springframework.context.annotation.Import;

/**
 * Controller tests for AdminOrderController.
 * Class-level @PreAuthorize("hasAuthority('ROLE_ADMIN')") must block customers and anonymous.
 */
@WebMvcTest(AdminOrderController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, JwtAuthenticationEntryPoint.class})
class AdminOrderControllerTest {

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
    private UserDetailsImpl adminDetails;
    private UserDetailsImpl customerDetails;

    @BeforeEach
    void setUp() {
        User admin = new User("admin", "admin@test.com", "pass",
                "Admin Test", "999000002", "Sede", Role.ROLE_ADMIN);
        admin.setId(2L);
        adminDetails = UserDetailsImpl.build(admin);

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
                List.of(), List.of()
        );
    }

    // ── SECURITY: CUSTOMER CANNOT ACCESS ADMIN ENDPOINTS ─────────────────────────

    @Test
    void getAllOrders_shouldReturn403_whenCustomer() throws Exception {
        mockMvc.perform(get("/api/admin/orders")
                        .with(user(customerDetails)))
                .andExpect(status().isForbidden());
    }

    @Test
    void getAllOrders_shouldReturn401_whenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/admin/orders"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateStatus_shouldReturn403_whenCustomer() throws Exception {
        OrderStatusUpdateRequest req = new OrderStatusUpdateRequest(OrderStatus.EN_COCINA, "Test");
        mockMvc.perform(put("/api/admin/orders/1/status")
                        .with(user(customerDetails))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());
    }

    // ── ADMIN ENDPOINTS ───────────────────────────────────────────────────────────

    @Test
    void getAllOrders_shouldReturn200_whenAdmin() throws Exception {
        when(orderService.getAllOrders(null)).thenReturn(List.of(sampleOrderResponse));

        mockMvc.perform(get("/api/admin/orders")
                        .with(user(adminDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].orderNumber").value("BW-100001"));
    }

    @Test
    void getAllOrders_withStatusFilter_shouldReturn200_whenAdmin() throws Exception {
        when(orderService.getAllOrders("PENDIENTE")).thenReturn(List.of(sampleOrderResponse));

        mockMvc.perform(get("/api/admin/orders?status=PENDIENTE")
                        .with(user(adminDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PENDIENTE"));
    }

    @Test
    void updateOrderStatus_shouldReturn200_whenAdmin() throws Exception {
        OrderResponse updatedResponse = new OrderResponse(
                1L, "BW-100001", 1L, "Cliente Test", "999000001",
                OrderStatus.EN_COCINA, PaymentMethod.TRANSFERENCIA,
                "Av. Benavides 1940", "991234567", null,
                new BigDecimal("35.00"), BigDecimal.ZERO, new BigDecimal("35.00"),
                45, LocalDateTime.now(), LocalDateTime.now(),
                List.of(), List.of()
        );
        when(orderService.updateOrderStatus(anyLong(), any(), any())).thenReturn(updatedResponse);

        OrderStatusUpdateRequest req = new OrderStatusUpdateRequest(
                OrderStatus.EN_COCINA, "Derivado a cocina");

        mockMvc.perform(put("/api/admin/orders/1/status")
                        .with(user(adminDetails))
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("EN_COCINA"));
    }

    @Test
    void getOrderLogs_shouldReturn200_whenAdmin() throws Exception {
        OrderStatusLogResponse log = new OrderStatusLogResponse(
                1L, null, OrderStatus.PENDIENTE, "cliente", "Pedido creado", LocalDateTime.now());
        when(orderService.getOrderLogs(1L)).thenReturn(List.of(log));

        mockMvc.perform(get("/api/admin/orders/1/logs")
                        .with(user(adminDetails)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].newStatus").value("PENDIENTE"))
                .andExpect(jsonPath("$[0].changedByUsername").value("cliente"));
    }
}
