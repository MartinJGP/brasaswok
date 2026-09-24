package com.brasaswok.service;

import com.brasaswok.dto.payment.PaymentRequest;
import com.brasaswok.dto.payment.PaymentResponse;
import com.brasaswok.security.service.UserDetailsImpl;

public interface PaymentService {

    PaymentResponse getPaymentByOrderId(Long orderId, UserDetailsImpl userDetails);

    PaymentResponse processPayment(PaymentRequest request, UserDetailsImpl userDetails);
}
