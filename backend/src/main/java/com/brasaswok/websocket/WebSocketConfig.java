package com.brasaswok.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Configuración mínima de WebSocket con STOMP.
 *
 * <p>El endpoint de conexión es {@code /ws-brasas} (ya permitido en SecurityConfig
 * sin autenticación para facilitar la conexión inicial).
 *
 * <p>El prefijo de destino para el cliente es {@code /topic}.
 * Ejemplo de suscripción del frontend:
 * <pre>
 *   stompClient.subscribe('/topic/orders/{orderId}/status', callback);
 * </pre>
 *
 * <p>Esta implementación usa el broker en memoria de Spring (no requiere
 * RabbitMQ ni ActiveMQ). Es adecuada para esta primera versión.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Broker en memoria para mensajes hacia el cliente
        registry.enableSimpleBroker("/topic");
        // Prefijo para mensajes del cliente al servidor (no se usa en este módulo)
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-brasas")
                .setAllowedOriginPatterns("http://localhost:4200", "http://127.0.0.1:4200")
                .withSockJS();
    }
}
