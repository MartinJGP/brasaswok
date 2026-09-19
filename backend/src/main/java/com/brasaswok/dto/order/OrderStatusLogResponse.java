package com.brasaswok.dto.order;

import com.brasaswok.model.OrderStatus;

import java.time.LocalDateTime;

public class OrderStatusLogResponse {

    private Long id;
    private OrderStatus previousStatus;
    private OrderStatus newStatus;
    private String changedByUsername;
    private String comment;
    private LocalDateTime createdAt;

    public OrderStatusLogResponse() {
    }

    public OrderStatusLogResponse(Long id, OrderStatus previousStatus, OrderStatus newStatus, String changedByUsername, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.changedByUsername = changedByUsername;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OrderStatus getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(OrderStatus previousStatus) {
        this.previousStatus = previousStatus;
    }

    public OrderStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(OrderStatus newStatus) {
        this.newStatus = newStatus;
    }

    public String getChangedByUsername() {
        return changedByUsername;
    }

    public void setChangedByUsername(String changedByUsername) {
        this.changedByUsername = changedByUsername;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
