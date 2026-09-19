package com.brasaswok.dto.order;

import com.brasaswok.model.OrderStatus;
import com.brasaswok.model.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {

    private Long id;
    private String orderNumber;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private String deliveryAddress;
    private String deliveryPhone;
    private String deliveryNotes;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal totalAmount;
    private Integer estimatedDeliveryMinutes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemResponse> items;
    private List<OrderStatusLogResponse> statusLogs;

    public OrderResponse() {
    }

    public OrderResponse(Long id, String orderNumber, Long customerId, String customerName, String customerPhone,
                         OrderStatus status, PaymentMethod paymentMethod, String deliveryAddress, String deliveryPhone,
                         String deliveryNotes, BigDecimal subtotal, BigDecimal deliveryFee, BigDecimal totalAmount,
                         Integer estimatedDeliveryMinutes, LocalDateTime createdAt, LocalDateTime updatedAt,
                         List<OrderItemResponse> items, List<OrderStatusLogResponse> statusLogs) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.deliveryAddress = deliveryAddress;
        this.deliveryPhone = deliveryPhone;
        this.deliveryNotes = deliveryNotes;
        this.subtotal = subtotal;
        this.deliveryFee = deliveryFee;
        this.totalAmount = totalAmount;
        this.estimatedDeliveryMinutes = estimatedDeliveryMinutes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.items = items;
        this.statusLogs = statusLogs;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getDeliveryPhone() {
        return deliveryPhone;
    }

    public void setDeliveryPhone(String deliveryPhone) {
        this.deliveryPhone = deliveryPhone;
    }

    public String getDeliveryNotes() {
        return deliveryNotes;
    }

    public void setDeliveryNotes(String deliveryNotes) {
        this.deliveryNotes = deliveryNotes;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getDeliveryFee() {
        return deliveryFee;
    }

    public void setDeliveryFee(BigDecimal deliveryFee) {
        this.deliveryFee = deliveryFee;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getEstimatedDeliveryMinutes() {
        return estimatedDeliveryMinutes;
    }

    public void setEstimatedDeliveryMinutes(Integer estimatedDeliveryMinutes) {
        this.estimatedDeliveryMinutes = estimatedDeliveryMinutes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }

    public List<OrderStatusLogResponse> getStatusLogs() {
        return statusLogs;
    }

    public void setStatusLogs(List<OrderStatusLogResponse> statusLogs) {
        this.statusLogs = statusLogs;
    }
}
