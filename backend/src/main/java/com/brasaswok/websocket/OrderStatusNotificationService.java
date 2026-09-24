package com.brasaswok.websocket;

import com.brasaswok.model.Order;
import com.brasaswok.model.OrderStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderStatusNotificationService {

    private static final Logger log = LoggerFactory.getLogger(OrderStatusNotificationService.class);

    private final SimpMessagingTemplate messagingTemplate;

    public OrderStatusNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyNewOrder(Order order) {
        try {
            record NewOrderPayload(Long orderId, String orderNumber, String customerName, String totalAmount, String message) {}
            Object payload = new NewOrderPayload(
                    order.getId(),
                    order.getOrderNumber(),
                    order.getCustomer() != null ? order.getCustomer().getFullName() : "",
                    order.getTotalAmount() != null ? order.getTotalAmount().toString() : "0.00",
                    "¡Nuevo pedido entrante! - Ticket #" + order.getOrderNumber()
            );
            messagingTemplate.convertAndSend("/topic/admin", payload);
            log.debug("WS notification sent to /topic/admin for ticket {}", order.getOrderNumber());
        } catch (Exception e) {
            log.warn("WebSocket notification to /topic/admin failed for order {}: {}", order.getId(), e.getMessage());
        }
    }

    public void notifyStatusChange(Order order, OrderStatus status) {
        try {
            record StatusPayload(Long orderId, String orderNumber, String status, String message) {}
            String message = switch (status) {
                case EN_COCINA -> "Tu pedido ya está siendo preparado";
                case EN_CAMINO -> "Tu pedido ya está en camino";
                case ENTREGADO -> "Tu pedido ha sido entregado";
                case CANCELADO -> "Tu pedido ha sido cancelado";
                default -> "Estado actualizado: " + status.name();
            };
            Object payload = new StatusPayload(order.getId(), order.getOrderNumber(), status.name(), message);
            messagingTemplate.convertAndSend("/topic/orders/" + order.getId() + "/status", payload);
            messagingTemplate.convertAndSend("/topic/pedido/" + order.getId(), payload);
            log.debug("WS notification sent for order {} → {}", order.getId(), status);
        } catch (Exception e) {
            log.warn("WebSocket notification failed for order {}: {}", order.getId(), e.getMessage());
        }
    }
}
