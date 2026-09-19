package com.brasaswok.dto.order;

import com.brasaswok.model.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public class OrderCreateRequest {

    @NotBlank(message = "Delivery address is required")
    @Size(max = 255, message = "Delivery address must not exceed 255 characters")
    private String deliveryAddress;

    @NotBlank(message = "Delivery phone is required")
    @Size(max = 20, message = "Delivery phone must not exceed 20 characters")
    private String deliveryPhone;

    @Size(max = 255, message = "Delivery notes must not exceed 255 characters")
    private String deliveryNotes;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;

    public OrderCreateRequest() {
    }

    public OrderCreateRequest(String deliveryAddress, String deliveryPhone, String deliveryNotes, PaymentMethod paymentMethod, List<OrderItemRequest> items) {
        this.deliveryAddress = deliveryAddress;
        this.deliveryPhone = deliveryPhone;
        this.deliveryNotes = deliveryNotes;
        this.paymentMethod = paymentMethod;
        this.items = items;
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

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}
