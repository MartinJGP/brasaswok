package com.brasaswok.websocket;

import com.brasaswok.model.Order;
import com.brasaswok.model.OrderStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Servicio auxiliar para notificar cambios de estado de pedidos vía WebSocket.
 *
 * <p>Completamente desacoplado del flujo REST/transaccional. Si el envío falla,
 * solo se registra un warning; la transacción ya habrá commiteado correctamente.
 *
 * <p>El frontend se suscribe a:
 * <pre>
 *   /topic/orders/{orderId}/status
 * </pre>
 * y recibe un objeto con {@code orderId}, {@code orderNumber} y {@code status}.
 */
@Service
public class OrderStatusNotificationService {

    private static final Logger log = LoggerFactory.getLogger(OrderStatusNotificationService.class);

    private final SimpMessagingTemplate messagingTemplate;

    public OrderStatusNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Publica una notificación de cambio de estado para el pedido indicado.
     *
     * @param order  pedido cuyo estado cambió
     * @param status nuevo estado
     */
    public void notifyStatusChange(Order order, OrderStatus status) {
        try {
            String destination = "/topic/orders/" + order.getId() + "/status";
            // Usamos un record anónimo para evitar ambigüedad con Map en convertAndSend
            record StatusPayload(Long orderId, String orderNumber, String status) {}
            Object payload = new StatusPayload(order.getId(), order.getOrderNumber(), status.name());
            messagingTemplate.convertAndSend(destination, payload);
            log.debug("WS notification sent to {} → {}", destination, status);
        } catch (Exception e) {
            // El fallo WebSocket NO debe romper la operación REST ya commiteada
            log.warn("WebSocket notification failed for order {}: {}", order.getId(), e.getMessage());
        }
    }
}
