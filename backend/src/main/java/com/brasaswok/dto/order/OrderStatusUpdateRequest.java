package com.brasaswok.dto.order;

import com.brasaswok.model.OrderStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class OrderStatusUpdateRequest {

    @NotNull(message = "Order status is required")
    private OrderStatus status;

    @Size(max = 255, message = "Comment must not exceed 255 characters")
    private String comment;

    public OrderStatusUpdateRequest() {
    }

    public OrderStatusUpdateRequest(OrderStatus status, String comment) {
        this.status = status;
        this.comment = comment;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
