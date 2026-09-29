package com.brasaswok.service;

import com.brasaswok.dto.dashboard.DashboardStatsResponse;
import com.brasaswok.model.Order;
import com.brasaswok.model.OrderItem;
import com.brasaswok.model.OrderStatus;
import com.brasaswok.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    private final OrderRepository orderRepository;

    public AdminDashboardService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        List<Order> allOrders = orderRepository.findAll();

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);

        List<Order> todayOrders = allOrders.stream()
                .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(startOfDay) && !o.getCreatedAt().isAfter(endOfDay))
                .toList();

        List<Order> validTodayOrders = todayOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELADO)
                .toList();

        BigDecimal todaySales = validTodayOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long activeOrdersCount = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PENDIENTE ||
                             o.getStatus() == OrderStatus.EN_COCINA ||
                             o.getStatus() == OrderStatus.EN_CAMINO)
                .count();

        long totalOrdersTodayCount = todayOrders.size();

        BigDecimal averageTicket = BigDecimal.ZERO;
        if (!validTodayOrders.isEmpty()) {
            averageTicket = todaySales.divide(BigDecimal.valueOf(validTodayOrders.size()), 2, RoundingMode.HALF_UP);
        }

        Map<String, Long> ordersByStatus = new HashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            ordersByStatus.put(status.name(), 0L);
        }
        for (Order o : allOrders) {
            ordersByStatus.put(o.getStatus().name(), ordersByStatus.getOrDefault(o.getStatus().name(), 0L) + 1);
        }

        Map<String, List<OrderItem>> itemsByProduct = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELADO)
                .flatMap(o -> o.getItems().stream())
                .collect(Collectors.groupingBy(OrderItem::getProductName));

        List<DashboardStatsResponse.TopDishStat> topDishes = itemsByProduct.entrySet().stream()
                .map(entry -> {
                    String name = entry.getKey();
                    long qty = entry.getValue().stream().mapToLong(OrderItem::getQuantity).sum();
                    BigDecimal revenue = entry.getValue().stream()
                            .map(OrderItem::getSubtotal)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new DashboardStatsResponse.TopDishStat(name, qty, revenue);
                })
                .sorted(Comparator.comparing(DashboardStatsResponse.TopDishStat::getQuantity).reversed())
                .limit(5)
                .toList();

        return new DashboardStatsResponse(
                todaySales,
                activeOrdersCount,
                averageTicket,
                totalOrdersTodayCount,
                ordersByStatus,
                topDishes
        );
    }
}
