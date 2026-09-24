package com.brasaswok.service.impl;

import com.brasaswok.dto.order.OrderCreateRequest;
import com.brasaswok.dto.order.OrderItemRequest;
import com.brasaswok.dto.order.OrderItemResponse;
import com.brasaswok.dto.order.OrderResponse;
import com.brasaswok.dto.order.OrderStatusLogResponse;
import com.brasaswok.dto.order.OrderStatusUpdateRequest;
import com.brasaswok.exception.BadRequestException;
import com.brasaswok.exception.ResourceNotFoundException;
import com.brasaswok.model.Order;
import com.brasaswok.model.OrderItem;
import com.brasaswok.model.OrderStatus;
import com.brasaswok.model.OrderStatusLog;
import com.brasaswok.model.Payment;
import com.brasaswok.model.Product;
import com.brasaswok.model.User;
import com.brasaswok.repository.OrderRepository;
import com.brasaswok.repository.OrderStatusLogRepository;
import com.brasaswok.repository.ProductRepository;
import com.brasaswok.repository.UserRepository;
import com.brasaswok.security.service.UserDetailsImpl;
import com.brasaswok.service.OrderService;
import com.brasaswok.websocket.OrderStatusNotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;
import java.util.Set;

@Service
public class OrderServiceImpl implements OrderService {

    // ── Transiciones de estado permitidas ────────────────────────────────────────
    // Se centraliza aquí para no dispersar la lógica.
    private static final java.util.Map<OrderStatus, Set<OrderStatus>> VALID_TRANSITIONS = java.util.Map.of(
            OrderStatus.PENDIENTE,  Set.of(OrderStatus.EN_COCINA, OrderStatus.CANCELADO),
            OrderStatus.EN_COCINA,  Set.of(OrderStatus.EN_CAMINO, OrderStatus.CANCELADO),
            OrderStatus.EN_CAMINO,  Set.of(OrderStatus.ENTREGADO),
            OrderStatus.ENTREGADO,  Set.of(),   // estado final
            OrderStatus.CANCELADO,  Set.of()    // estado final
    );

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderStatusLogRepository statusLogRepository;
    private final OrderStatusNotificationService notificationService;

    public OrderServiceImpl(OrderRepository orderRepository,
                            ProductRepository productRepository,
                            UserRepository userRepository,
                            OrderStatusLogRepository statusLogRepository,
                            OrderStatusNotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.statusLogRepository = statusLogRepository;
        this.notificationService = notificationService;
    }

    // ── CREATE ORDER ─────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request, UserDetailsImpl userDetails) {

        // 1. Obtener el User autenticado desde la BD (nunca confiar en el frontend)
        User customer = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        // 2. Validar y construir los OrderItems
        List<OrderItem> orderItems = buildOrderItems(request.getItems());

        // 3. Calcular subtotal
        BigDecimal subtotal = orderItems.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Calcular delivery fee (lógica aislada para futura configuración)
        BigDecimal deliveryFee = calculateDeliveryFee(request.getDeliveryAddress());

        // 5. Calcular total
        BigDecimal totalAmount = subtotal.add(deliveryFee);

        // 6. Generar número de pedido único
        String orderNumber = generateUniqueOrderNumber();

        // 7. Crear la Order
        Order order = new Order(
                orderNumber,
                customer,
                request.getPaymentMethod(),
                request.getDeliveryAddress(),
                request.getDeliveryPhone(),
                request.getDeliveryNotes(),
                subtotal,
                deliveryFee,
                totalAmount
        );

        // 8. Vincular los OrderItems a la Order
        orderItems.forEach(order::addItem);

        // 9. Crear el Payment PENDIENTE
        Payment payment = new Payment(order, request.getPaymentMethod(), totalAmount, null);
        order.setPayment(payment);

        // 10. Crear el primer OrderStatusLog
        OrderStatusLog firstLog = new OrderStatusLog(
                order,
                null,
                OrderStatus.PENDIENTE,
                customer,
                "Pedido creado"
        );
        order.addStatusLog(firstLog);

        // 11. Guardar la Order (cascade persiste Items, Payment y StatusLog)
        Order saved = orderRepository.save(order);

        // 12. Mapear y devolver respuesta
        return toOrderResponse(saved);
    }

    // ── GET MY ORDERS ─────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(UserDetailsImpl userDetails) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(userDetails.getId())
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    // ── GET ORDER BY ID (cliente) ─────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId, UserDetailsImpl userDetails) {
        // Devuelve 404 si el pedido no existe O pertenece a otro cliente
        Order order = orderRepository.findByIdAndCustomerId(orderId, userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return toOrderResponse(order);
    }

    // ── GET ALL ORDERS (admin) ─────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders(String status) {
        List<Order> orders;
        if (status != null && !status.isBlank()) {
            OrderStatus orderStatus = parseOrderStatus(status);
            orders = orderRepository.findByStatusOrderByCreatedAtDesc(orderStatus);
        } else {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }
        return orders.stream().map(this::toOrderResponse).toList();
    }

    // ── UPDATE ORDER STATUS (admin) ───────────────────────────────────────────────

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request,
                                           UserDetailsImpl adminDetails) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();

        // Validar transición de estado
        validateStatusTransition(currentStatus, newStatus);

        // Obtener el admin como User
        User admin = userRepository.findById(adminDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        // Actualizar estado
        order.setStatus(newStatus);

        // Crear log
        OrderStatusLog log = new OrderStatusLog(
                order,
                currentStatus,
                newStatus,
                admin,
                request.getComment()
        );
        order.addStatusLog(log);

        Order updated = orderRepository.save(order);

        // Notificar vía WebSocket (fuera de la tx; el fallo no revierte el cambio)
        notificationService.notifyStatusChange(updated, newStatus);

        return toOrderResponse(updated);
    }

    // ── GET ORDER LOGS (admin) ────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<OrderStatusLogResponse> getOrderLogs(Long orderId) {
        // Verificar que el pedido existe
        if (!orderRepository.existsById(orderId)) {
            throw new ResourceNotFoundException("Order not found with id: " + orderId);
        }
        return statusLogRepository.findByOrderIdOrderByCreatedAtAsc(orderId)
                .stream()
                .map(this::toStatusLogResponse)
                .toList();
    }

    // ── LÓGICA INTERNA ────────────────────────────────────────────────────────────

    /**
     * Valida y construye la lista de OrderItems a partir de los requests.
     * Verifica existencia, disponibilidad y cantidad. El precio siempre proviene de la BD.
     */
    private List<OrderItem> buildOrderItems(List<OrderItemRequest> itemRequests) {
        return itemRequests.stream().map(itemReq -> {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with id: " + itemReq.getProductId()));

            if (!Boolean.TRUE.equals(product.getIsAvailable())) {
                throw new BadRequestException(
                        "Product '" + product.getName() + "' is not available");
            }

            // quantity >= 1 ya validado por @Min(1) en el DTO; doble check defensivo
            if (itemReq.getQuantity() == null || itemReq.getQuantity() < 1) {
                throw new BadRequestException("Quantity must be at least 1 for product: " + product.getName());
            }

            // Precio real desde BD, nunca del frontend
            BigDecimal unitPrice = product.getPrice();
            BigDecimal quantity = BigDecimal.valueOf(itemReq.getQuantity());
            BigDecimal subtotal = unitPrice.multiply(quantity);

            return new OrderItem(
                    null,          // id generado por JPA
                    product,
                    product.getName(),  // snapshot del nombre
                    itemReq.getQuantity(),
                    unitPrice,
                    subtotal,
                    itemReq.getNotes()
            );
        }).toList();
    }

    /**
     * Calcula el costo de delivery.
     *
     * <p><b>Decisión v1:</b> delivery fee fijo en 0.00 hasta que el negocio defina
     * la tabla de tarifas por distrito o distancia. La lógica está aislada aquí
     * para reemplazarla fácilmente en el futuro.
     *
     * @param deliveryAddress dirección de entrega (reservado para lógica futura)
     * @return BigDecimal con el costo de delivery
     */
    private BigDecimal calculateDeliveryFee(String deliveryAddress) {
        // TODO: implementar lógica de tarifas cuando el negocio lo defina
        return BigDecimal.ZERO;
    }

    /**
     * Genera un número de pedido único con formato {@code BW-XXXXXX}.
     *
     * <p><b>Estrategia:</b> 6 dígitos aleatorios via {@link SecureRandom} + verificación
     * de unicidad en BD. La restricción {@code unique=true} de la columna actúa como
     * red de seguridad ante colisiones concurrentes. Estadísticamente, con 10^6 combinaciones
     * posibles y una BD pequeña, la probabilidad de colisión es despreciable.
     * Se hacen hasta 10 intentos antes de lanzar excepción.
     */
    private String generateUniqueOrderNumber() {
        for (int attempt = 0; attempt < 10; attempt++) {
            int randomPart = SECURE_RANDOM.nextInt(900000) + 100000; // 100000–999999
            String candidate = "BW-" + randomPart;
            if (!orderRepository.existsByOrderNumber(candidate)) {
                return candidate;
            }
        }
        throw new BadRequestException("Could not generate a unique order number. Please try again.");
    }

    /**
     * Valida que la transición de estado sea permitida.
     */
    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        Set<OrderStatus> allowed = VALID_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowed.contains(next)) {
            throw new BadRequestException(
                    "Invalid status transition from " + current + " to " + next +
                    ". Allowed: " + allowed);
        }
    }

    /**
     * Parsea el string de estado con mensaje de error claro.
     */
    private OrderStatus parseOrderStatus(String status) {
        try {
            return OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status +
                    ". Valid values: PENDIENTE, EN_COCINA, EN_CAMINO, ENTREGADO, CANCELADO");
        }
    }

    // ── MAPPERS ───────────────────────────────────────────────────────────────────

    /**
     * Mapea una Order a su OrderResponse.
     * Debe ejecutarse dentro de una transacción activa para evitar LazyInitializationException.
     */
    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(this::toOrderItemResponse)
                .toList();

        List<OrderStatusLogResponse> logResponses = order.getStatusLogs().stream()
                .map(this::toStatusLogResponse)
                .toList();

        User customer = order.getCustomer();

        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                customer.getId(),
                customer.getFullName(),
                customer.getPhone(),
                order.getStatus(),
                order.getPaymentMethod(),
                order.getDeliveryAddress(),
                order.getDeliveryPhone(),
                order.getDeliveryNotes(),
                order.getSubtotal(),
                order.getDeliveryFee(),
                order.getTotalAmount(),
                order.getEstimatedDeliveryMinutes(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                itemResponses,
                logResponses
        );
    }

    private OrderItemResponse toOrderItemResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProductName(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getSubtotal(),
                item.getNotes()
        );
    }

    private OrderStatusLogResponse toStatusLogResponse(OrderStatusLog log) {
        String changedByUsername = log.getChangedByUser() != null
                ? log.getChangedByUser().getUsername()
                : "system";
        return new OrderStatusLogResponse(
                log.getId(),
                log.getPreviousStatus(),
                log.getNewStatus(),
                changedByUsername,
                log.getComment(),
                log.getCreatedAt()
        );
    }
}
