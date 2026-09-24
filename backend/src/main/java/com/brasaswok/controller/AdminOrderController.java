package com.brasaswok.controller;

import com.brasaswok.dto.order.OrderResponse;
import com.brasaswok.dto.order.OrderStatusLogResponse;
import com.brasaswok.dto.order.OrderStatusUpdateRequest;
import com.brasaswok.security.service.UserDetailsImpl;
import com.brasaswok.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller de administración para gestión de pedidos.
 * Toda la clase requiere ROLE_ADMIN (también reforzado a nivel HTTP en SecurityConfig).
 */
@RestController
@RequestMapping("/api/admin/orders")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * GET /api/admin/orders
     * Lista todos los pedidos. Filtrado opcional por estado: ?status=PENDIENTE
     */
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(orderService.getAllOrders(status));
    }

    /**
     * PUT /api/admin/orders/{id}/status
     * Cambia el estado de un pedido y registra el log con el admin autenticado.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request, userDetails));
    }

    /**
     * GET /api/admin/orders/{id}/logs
     * Devuelve el historial de cambios de estado de un pedido, ordenado cronológicamente.
     */
    @GetMapping("/{id}/logs")
    public ResponseEntity<List<OrderStatusLogResponse>> getOrderLogs(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderLogs(id));
    }
}
