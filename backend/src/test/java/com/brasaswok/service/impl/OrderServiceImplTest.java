package com.brasaswok.service.impl;

import com.brasaswok.dto.order.OrderCreateRequest;
import com.brasaswok.dto.order.OrderItemRequest;
import com.brasaswok.dto.order.OrderResponse;
import com.brasaswok.dto.order.OrderStatusUpdateRequest;
import com.brasaswok.exception.BadRequestException;
import com.brasaswok.exception.ResourceNotFoundException;
import com.brasaswok.model.Category;
import com.brasaswok.model.Order;
import com.brasaswok.model.OrderItem;
import com.brasaswok.model.OrderStatus;
import com.brasaswok.model.OrderStatusLog;
import com.brasaswok.model.Payment;
import com.brasaswok.model.PaymentMethod;
import com.brasaswok.model.PaymentStatus;
import com.brasaswok.model.Product;
import com.brasaswok.model.Role;
import com.brasaswok.model.User;
import com.brasaswok.repository.OrderRepository;
import com.brasaswok.repository.OrderStatusLogRepository;
import com.brasaswok.repository.ProductRepository;
import com.brasaswok.repository.UserRepository;
import com.brasaswok.security.service.UserDetailsImpl;
import com.brasaswok.websocket.OrderStatusNotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceImplTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private OrderStatusLogRepository statusLogRepository;
    @Mock
    private OrderStatusNotificationService notificationService;

    @InjectMocks
    private OrderServiceImpl orderService;

    private User customer;
    private User admin;
    private Product product;
    private UserDetailsImpl customerDetails;
    private UserDetailsImpl adminDetails;

    @BeforeEach
    void setUp() {
        customer = new User("cliente", "cliente@test.com", "pass", "Cliente Test",
                "999000001", "Av. Lima 123", Role.ROLE_CUSTOMER);
        customer.setId(1L);

        admin = new User("admin", "admin@test.com", "pass", "Admin Test",
                "999000002", "Sede central", Role.ROLE_ADMIN);
        admin.setId(2L);

        Category cat = new Category();
        cat.setId(1L);
        cat.setName("Platos");

        product = new Product(cat, "Pollo a la Brasa", "pollo-brasa",
                "Descripcion", new BigDecimal("35.00"), null, true);
        product.setId(1L);

        customerDetails = UserDetailsImpl.build(customer);
        adminDetails = UserDetailsImpl.build(admin);
    }

    // ── CREATE ORDER ─────────────────────────────────────────────────────────────

    @Test
    void createOrder_shouldReturnOrderResponse_whenValid() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.existsByOrderNumber(anyString())).thenReturn(false);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId(10L);
            o.setCreatedAt(LocalDateTime.now());
            return o;
        });

        OrderCreateRequest request = new OrderCreateRequest(
                "Av. Benavides 1940", "991234567", "Piso 5",
                PaymentMethod.TRANSFERENCIA,
                List.of(new OrderItemRequest(1L, 2, "Sin ají")));

        // Act
        OrderResponse response = orderService.createOrder(request, customerDetails);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getCustomerId()).isEqualTo(1L);
        assertThat(response.getCustomerName()).isEqualTo("Cliente Test");
        assertThat(response.getStatus()).isEqualTo(OrderStatus.PENDIENTE);
        assertThat(response.getSubtotal()).isEqualByComparingTo(new BigDecimal("70.00")); // 35 * 2
        assertThat(response.getDeliveryFee()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.getTotalAmount()).isEqualByComparingTo(new BigDecimal("70.00"));
        assertThat(response.getItems()).hasSize(1);
        assertThat(response.getStatusLogs()).hasSize(1);
        assertThat(response.getStatusLogs().get(0).getNewStatus()).isEqualTo(OrderStatus.PENDIENTE);
        assertThat(response.getStatusLogs().get(0).getPreviousStatus()).isNull();
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_shouldThrow_whenProductNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        OrderCreateRequest request = new OrderCreateRequest(
                "Av. Lima 1", "991111111", null, PaymentMethod.EFECTIVO,
                List.of(new OrderItemRequest(99L, 1, null)));

        assertThatThrownBy(() -> orderService.createOrder(request, customerDetails))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void createOrder_shouldThrow_whenProductNotAvailable() {
        product.setIsAvailable(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        OrderCreateRequest request = new OrderCreateRequest(
                "Av. Lima 1", "991111111", null, PaymentMethod.EFECTIVO,
                List.of(new OrderItemRequest(1L, 1, null)));

        assertThatThrownBy(() -> orderService.createOrder(request, customerDetails))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("not available");
    }

    @Test
    void createOrder_shouldUseRealPrice_notFrontendPrice() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.existsByOrderNumber(anyString())).thenReturn(false);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId(1L);
            o.setCreatedAt(LocalDateTime.now());
            return o;
        });

        OrderCreateRequest request = new OrderCreateRequest(
                "Av. Lima 1", "991111111", null, PaymentMethod.EFECTIVO,
                List.of(new OrderItemRequest(1L, 3, null)));

        OrderResponse response = orderService.createOrder(request, customerDetails);

        assertThat(response.getSubtotal()).isEqualByComparingTo(new BigDecimal("105.00"));
        assertThat(response.getItems().get(0).getUnitPrice()).isEqualByComparingTo(new BigDecimal("35.00"));
    }

    @Test
    void createOrder_shouldCreatePaymentPendiente() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.existsByOrderNumber(anyString())).thenReturn(false);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId(1L);
            o.setCreatedAt(LocalDateTime.now());
            return o;
        });

        OrderCreateRequest request = new OrderCreateRequest(
                "Av. Lima 1", "991111111", null, PaymentMethod.YAPE_PLIN,
                List.of(new OrderItemRequest(1L, 1, null)));

        orderService.createOrder(request, customerDetails);

        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_shouldCreateFirstStatusLog() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(orderRepository.existsByOrderNumber(anyString())).thenReturn(false);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setId(1L);
            o.setCreatedAt(LocalDateTime.now());
            return o;
        });

        OrderCreateRequest request = new OrderCreateRequest(
                "Av. Lima 1", "991111111", null, PaymentMethod.EFECTIVO,
                List.of(new OrderItemRequest(1L, 1, null)));

        OrderResponse response = orderService.createOrder(request, customerDetails);

        assertThat(response.getStatusLogs()).hasSize(1);
        assertThat(response.getStatusLogs().get(0).getNewStatus()).isEqualTo(OrderStatus.PENDIENTE);
        assertThat(response.getStatusLogs().get(0).getPreviousStatus()).isNull();
        assertThat(response.getStatusLogs().get(0).getComment()).contains("creado");
    }

    // ── GET MY ORDERS
    // ─────────────────────────────────────────────────────────────

    @Test
    void getMyOrders_shouldReturnOnlyCustomerOrders() {
        Order order = buildSavedOrder(customer);
        when(orderRepository.findByCustomerIdOrderByCreatedAtDesc(1L)).thenReturn(List.of(order));

        List<OrderResponse> result = orderService.getMyOrders(customerDetails);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCustomerId()).isEqualTo(1L);
    }

    @Test
    void getMyOrders_shouldNotReturnOtherCustomersOrders() {
        // El repository filtra por customerId, así que si otro cliente tiene pedidos no
        // aparecen
        when(orderRepository.findByCustomerIdOrderByCreatedAtDesc(1L)).thenReturn(List.of());

        List<OrderResponse> result = orderService.getMyOrders(customerDetails);

        assertThat(result).isEmpty();
    }

    // ── GET ORDER BY ID
    // ───────────────────────────────────────────────────────────

    @Test
    void getOrderById_shouldThrow_whenOrderBelongsToAnotherCustomer() {
        // findByIdAndCustomerId devuelve empty si el pedido es de otro cliente
        when(orderRepository.findByIdAndCustomerId(5L, 1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrderById(5L, customerDetails))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Order not found");
    }

    // ── STATUS TRANSITIONS
    // ────────────────────────────────────────────────────────

    @Test
    void updateStatus_PENDIENTE_to_EN_COCINA_shouldSucceed() {
        Order order = buildSavedOrder(customer);
        order.setStatus(OrderStatus.PENDIENTE);

        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(userRepository.findById(2L)).thenReturn(Optional.of(admin));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        OrderStatusUpdateRequest req = new OrderStatusUpdateRequest(
                OrderStatus.EN_COCINA, "Enviado a cocina");
        OrderResponse response = orderService.updateOrderStatus(10L, req, adminDetails);

        assertThat(response.getStatus()).isEqualTo(OrderStatus.EN_COCINA);
    }

    @Test
    void updateStatus_EN_COCINA_to_EN_CAMINO_shouldSucceed() {
        Order order = buildSavedOrder(customer);
        order.setStatus(OrderStatus.EN_COCINA);

        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(userRepository.findById(2L)).thenReturn(Optional.of(admin));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        OrderStatusUpdateRequest req = new OrderStatusUpdateRequest(OrderStatus.EN_CAMINO, "En camino");
        orderService.updateOrderStatus(10L, req, adminDetails);
        assertThat(order.getStatus()).isEqualTo(OrderStatus.EN_CAMINO);
    }

    @Test
    void updateStatus_EN_CAMINO_to_ENTREGADO_shouldSucceed() {
        Order order = buildSavedOrder(customer);
        order.setStatus(OrderStatus.EN_CAMINO);

        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(userRepository.findById(2L)).thenReturn(Optional.of(admin));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        OrderStatusUpdateRequest req = new OrderStatusUpdateRequest(OrderStatus.ENTREGADO, "Entregado");
        orderService.updateOrderStatus(10L, req, adminDetails);
        assertThat(order.getStatus()).isEqualTo(OrderStatus.ENTREGADO);
    }

    @Test
    void updateStatus_invalidTransition_shouldThrowBadRequest() {
        Order order = buildSavedOrder(customer);
        order.setStatus(OrderStatus.ENTREGADO);

        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));

        OrderStatusUpdateRequest req = new OrderStatusUpdateRequest(OrderStatus.PENDIENTE, "Revertir");

        assertThatThrownBy(() -> orderService.updateOrderStatus(10L, req, adminDetails))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Invalid status transition");
    }

    @Test
    void updateStatus_shouldCreateLog_withAdminUser() {
        Order order = buildSavedOrder(customer);
        order.setStatus(OrderStatus.PENDIENTE);

        when(orderRepository.findById(10L)).thenReturn(Optional.of(order));
        when(userRepository.findById(2L)).thenReturn(Optional.of(admin));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        OrderStatusUpdateRequest req = new OrderStatusUpdateRequest(
                OrderStatus.EN_COCINA, "Preparando pedido");
        orderService.updateOrderStatus(10L, req, adminDetails);

        // El log más reciente debe tener el admin como changedByUser
        OrderStatusLog lastLog = order.getStatusLogs().get(order.getStatusLogs().size() - 1);
        assertThat(lastLog.getChangedByUser().getUsername()).isEqualTo("admin");
        assertThat(lastLog.getNewStatus()).isEqualTo(OrderStatus.EN_COCINA);
        assertThat(lastLog.getPreviousStatus()).isEqualTo(OrderStatus.PENDIENTE);
    }

    // ── HELPERS
    // ───────────────────────────────────────────────────────────────────

    private Order buildSavedOrder(User owner) {
        Order order = new Order("BW-123456", owner, PaymentMethod.EFECTIVO,
                "Av. Lima 1", "991111111", null,
                new BigDecimal("35.00"), BigDecimal.ZERO, new BigDecimal("35.00"));
        order.setId(10L);
        order.setCreatedAt(LocalDateTime.now());
        order.setItems(new ArrayList<>());
        order.setStatusLogs(new ArrayList<>());

        OrderItem item = new OrderItem(null, product, "Pollo", 1,
                new BigDecimal("35.00"), new BigDecimal("35.00"), null);
        item.setId(1L);
        order.getItems().add(item);
        item.setOrder(order);

        Payment payment = new Payment(order, PaymentMethod.EFECTIVO, new BigDecimal("35.00"), null);
        payment.setId(1L);
        payment.setCreatedAt(LocalDateTime.now());
        order.setPayment(payment);

        OrderStatusLog log = new OrderStatusLog(order, null, OrderStatus.PENDIENTE, owner, "Pedido creado");
        log.setId(1L);
        log.setCreatedAt(LocalDateTime.now());
        order.getStatusLogs().add(log);
        log.setOrder(order);

        return order;
    }
}
