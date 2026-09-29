package com.brasaswok.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    private BigDecimal todaySales;
    private Long activeOrders;
    private BigDecimal averageTicket;
    private Long totalOrdersToday;
    private Map<String, Long> ordersByStatus;
    private List<TopDishStat> topDishes;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(BigDecimal todaySales, Long activeOrders, BigDecimal averageTicket,
                                  Long totalOrdersToday, Map<String, Long> ordersByStatus, List<TopDishStat> topDishes) {
        this.todaySales = todaySales;
        this.activeOrders = activeOrders;
        this.averageTicket = averageTicket;
        this.totalOrdersToday = totalOrdersToday;
        this.ordersByStatus = ordersByStatus;
        this.topDishes = topDishes;
    }

    public BigDecimal getTodaySales() {
        return todaySales;
    }

    public void setTodaySales(BigDecimal todaySales) {
        this.todaySales = todaySales;
    }

    public Long getActiveOrders() {
        return activeOrders;
    }

    public void setActiveOrders(Long activeOrders) {
        this.activeOrders = activeOrders;
    }

    public BigDecimal getAverageTicket() {
        return averageTicket;
    }

    public void setAverageTicket(BigDecimal averageTicket) {
        this.averageTicket = averageTicket;
    }

    public Long getTotalOrdersToday() {
        return totalOrdersToday;
    }

    public void setTotalOrdersToday(Long totalOrdersToday) {
        this.totalOrdersToday = totalOrdersToday;
    }

    public Map<String, Long> getOrdersByStatus() {
        return ordersByStatus;
    }

    public void setOrdersByStatus(Map<String, Long> ordersByStatus) {
        this.ordersByStatus = ordersByStatus;
    }

    public List<TopDishStat> getTopDishes() {
        return topDishes;
    }

    public void setTopDishes(List<TopDishStat> topDishes) {
        this.topDishes = topDishes;
    }

    public static class TopDishStat {
        private String name;
        private Long quantity;
        private BigDecimal revenue;

        public TopDishStat() {
        }

        public TopDishStat(String name, Long quantity, BigDecimal revenue) {
            this.name = name;
            this.quantity = quantity;
            this.revenue = revenue;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getQuantity() {
            return quantity;
        }

        public void setQuantity(Long quantity) {
            this.quantity = quantity;
        }

        public BigDecimal getRevenue() {
            return revenue;
        }

        public void setRevenue(BigDecimal revenue) {
            this.revenue = revenue;
        }
    }
}
