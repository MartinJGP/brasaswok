package com.brasaswok.service;

import com.brasaswok.dto.auth.AuthResponse;
import com.brasaswok.dto.auth.LoginRequest;
import com.brasaswok.dto.auth.MessageResponse;
import com.brasaswok.dto.auth.RegisterRequest;

public interface AuthService {

    AuthResponse login(LoginRequest loginRequest);

    MessageResponse register(RegisterRequest registerRequest);
}
