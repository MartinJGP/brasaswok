package com.brasaswok.dto.payment;

import com.brasaswok.model.PaymentMethod;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class PaymentRequest {

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @Size(max = 100, message = "Transaction reference must not exceed 100 characters")
    private String transactionReference;

    public PaymentRequest() {
    }

    public PaymentRequest(PaymentMethod paymentMethod, BigDecimal amount, String transactionReference) {
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.transactionReference = transactionReference;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
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
}
