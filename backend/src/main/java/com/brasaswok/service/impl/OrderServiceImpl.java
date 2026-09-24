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

    private static final java.util.Map<OrderStatus, Set<OrderStatus>> VALID_TRANSITIONS = java.util.Map.of(
            OrderStatus.PENDIENTE,  Set.of(OrderStatus.EN_COCINA, OrderStatus.CANCELADO),
            OrderStatus.EN_COCINA,  Set.of(OrderStatus.EN_CAMINO, OrderStatus.CANCELADO),
            OrderStatus.EN_CAMINO,  Set.of(OrderStatus.ENTREGADO),
            OrderStatus.ENTREGADO,  Set.of(),
            OrderStatus.CANCELADO,  Set.of()
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

    @Override
    @Transactional
    public OrderResponse createOrder(OrderCreateRequest request, UserDetailsImpl userDetails) {
        User customer = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        List<OrderItem> orderItems = buildOrderItems(request.getItems());

        BigDecimal subtotal = orderItems.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal deliveryFee = calculateDeliveryFee(request.getDeliveryAddress());

        BigDecimal totalAmount = subtotal.add(deliveryFee);

        String orderNumber = generateUniqueOrderNumber();

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

        orderItems.forEach(order::addItem);

        Payment payment = new Payment(order, request.getPaymentMethod(), totalAmount, null);
        order.setPayment(payment);

        OrderStatusLog firstLog = new OrderStatusLog(
                order,
                null,
                OrderStatus.PENDIENTE,
                customer,
                "Pedido creado"
        );
        order.addStatusLog(firstLog);

        Order saved = orderRepository.save(order);

        notificationService.notifyNewOrder(saved);

        return toOrderResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(UserDetailsImpl userDetails) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(userDetails.getId())
                .stream()
                .map(this::toOrderResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId, UserDetailsImpl userDetails) {
        Order order = orderRepository.findByIdAndCustomerId(orderId, userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return toOrderResponse(order);
    }

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

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request,
                                           UserDetailsImpl adminDetails) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus currentStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();

        validateStatusTransition(currentStatus, newStatus);

        User admin = userRepository.findById(adminDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));

        order.setStatus(newStatus);

        OrderStatusLog log = new OrderStatusLog(
                order,
                currentStatus,
                newStatus,
                admin,
                request.getComment()
        );
        order.addStatusLog(log);

        Order updated = orderRepository.save(order);

        notificationService.notifyStatusChange(updated, newStatus);

        return toOrderResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderStatusLogResponse> getOrderLogs(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new ResourceNotFoundException("Order not found with id: " + orderId);
        }
        return statusLogRepository.findByOrderIdOrderByCreatedAtAsc(orderId)
                .stream()
                .map(this::toStatusLogResponse)
                .toList();
    }

    private List<OrderItem> buildOrderItems(List<OrderItemRequest> itemRequests) {
        return itemRequests.stream().map(itemReq -> {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with id: " + itemReq.getProductId()));

            if (!Boolean.TRUE.equals(product.getIsAvailable())) {
                throw new BadRequestException(
                        "Product '" + product.getName() + "' is not available");
            }
            if (itemReq.getQuantity() == null || itemReq.getQuantity() < 1) {
                throw new BadRequestException("Quantity must be at least 1 for product: " + product.getName());
            }

            BigDecimal unitPrice = product.getPrice();
            BigDecimal quantity = BigDecimal.valueOf(itemReq.getQuantity());
            BigDecimal subtotal = unitPrice.multiply(quantity);

            return new OrderItem(
                    null,
                    product,
                    product.getName(),
                    itemReq.getQuantity(),
                    unitPrice,
                    subtotal,
                    itemReq.getNotes()
            );
        }).toList();
    }

    private BigDecimal calculateDeliveryFee(String deliveryAddress) {
        return BigDecimal.ZERO;
    }

    private String generateUniqueOrderNumber() {
        for (int attempt = 0; attempt < 10; attempt++) {
            int randomPart = SECURE_RANDOM.nextInt(900000) + 100000;
            String candidate = "BW-" + randomPart;
            if (!orderRepository.existsByOrderNumber(candidate)) {
                return candidate;
            }
        }
        throw new BadRequestException("Could not generate a unique order number. Please try again.");
    }

    private void validateStatusTransition(OrderStatus current, OrderStatus next) {
        Set<OrderStatus> allowed = VALID_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowed.contains(next)) {
            throw new BadRequestException(
                    "Invalid status transition from " + current + " to " + next +
                    ". Allowed: " + allowed);
        }
    }

    private OrderStatus parseOrderStatus(String status) {
        try {
            return OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid order status: " + status +
                    ". Valid values: PENDIENTE, EN_COCINA, EN_CAMINO, ENTREGADO, CANCELADO");
        }
    }

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
