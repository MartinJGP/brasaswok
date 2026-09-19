package com.brasaswok.dto.payment;

import com.brasaswok.model.PaymentMethod;
import com.brasaswok.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {

    private Long id;
    private Long orderId;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private BigDecimal amount;
    private String transactionReference;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;

    public PaymentResponse() {
    }

    public PaymentResponse(Long id, Long orderId, PaymentMethod paymentMethod, PaymentStatus status, BigDecimal amount, String transactionReference, LocalDateTime paidAt, LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.paymentMethod = paymentMethod;
        this.status = status;
        this.amount = amount;
        this.transactionReference = transactionReference;
        this.paidAt = paidAt;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
