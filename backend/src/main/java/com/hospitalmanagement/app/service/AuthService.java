package com.hospitalmanagement.app.service;

import com.hospitalmanagement.app.dto.LoginRequestDTO;
import com.hospitalmanagement.app.dto.RegisterRequestDTO;
import com.hospitalmanagement.app.dto.UserResponseDTO;

public interface AuthService {
    String register(RegisterRequestDTO request);
    UserResponseDTO login(LoginRequestDTO request);
}
