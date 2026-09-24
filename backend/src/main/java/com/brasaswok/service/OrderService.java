package com.brasaswok.service;

import com.brasaswok.dto.order.OrderCreateRequest;
import com.brasaswok.dto.order.OrderResponse;
import com.brasaswok.dto.order.OrderStatusLogResponse;
import com.brasaswok.dto.order.OrderStatusUpdateRequest;
import com.brasaswok.security.service.UserDetailsImpl;

import java.util.List;

public interface OrderService {

    /**
     * Crea un nuevo pedido para el cliente autenticado.
     * Valida productos, calcula precios, crea Payment PENDIENTE y primer log.
     */
    OrderResponse createOrder(OrderCreateRequest request, UserDetailsImpl userDetails);

    /**
     * Devuelve los pedidos del cliente autenticado, ordenados por fecha desc.
     */
    List<OrderResponse> getMyOrders(UserDetailsImpl userDetails);

    /**
     * Devuelve un pedido por ID, verificando que pertenezca al cliente autenticado.
     */
    OrderResponse getOrderById(Long orderId, UserDetailsImpl userDetails);

    /**
     * Devuelve todos los pedidos (uso admin). Filtrado opcional por estado.
     */
    List<OrderResponse> getAllOrders(String status);

    /**
     * Cambia el estado de un pedido (uso admin). Valida la transición y registra log.
     */
    OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request, UserDetailsImpl adminDetails);

    /**
     * Devuelve el historial de logs de un pedido en orden cronológico (uso admin).
     */
    List<OrderStatusLogResponse> getOrderLogs(Long orderId);
}
