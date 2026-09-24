package com.brasaswok.service;

import com.brasaswok.dto.order.OrderCreateRequest;
import com.brasaswok.dto.order.OrderResponse;
import com.brasaswok.dto.order.OrderStatusLogResponse;
import com.brasaswok.dto.order.OrderStatusUpdateRequest;
import com.brasaswok.security.service.UserDetailsImpl;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(OrderCreateRequest request, UserDetailsImpl userDetails);

    List<OrderResponse> getMyOrders(UserDetailsImpl userDetails);

    OrderResponse getOrderById(Long orderId, UserDetailsImpl userDetails);

    List<OrderResponse> getAllOrders(String status);

    OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request, UserDetailsImpl adminDetails);

    List<OrderStatusLogResponse> getOrderLogs(Long orderId);
}
