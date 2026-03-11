package com.hospitalmanagement.app.service.impl;

import com.hospitalmanagement.app.dto.LoginRequestDTO;
import com.hospitalmanagement.app.dto.RegisterRequestDTO;
import com.hospitalmanagement.app.dto.UserResponseDTO;
import com.hospitalmanagement.app.entity.Department;
import com.hospitalmanagement.app.entity.User;
import com.hospitalmanagement.app.repository.DepartmentRepository;
import com.hospitalmanagement.app.repository.UserRepository;
import com.hospitalmanagement.app.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String register(RegisterRequestDTO request) {

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setSpecialization(request.getSpecialization());

        if (request.getDob() != null && !request.getDob().isEmpty()) {
            user.setDob(LocalDate.parse(request.getDob()));
        }
        user.setGender(request.getGender());
        user.setMobile(request.getMobile());

        if (request.getDepartmentId() != null) {
            user.setDepartment(
                    departmentRepository.findById(request.getDepartmentId())
                            .orElseThrow(() -> new RuntimeException("Department not found"))
            );
        } else if (request.getDepartmentName() != null && !request.getDepartmentName().isEmpty()) {
            user.setDepartment(
                    departmentRepository.findByName(request.getDepartmentName())
                            .orElseGet(() -> {
                                Department newDept = new Department();
                                newDept.setName(request.getDepartmentName());
                                return departmentRepository.save(newDept);
                            })
            );
        }

        userRepository.save(user);
        return "User Registered Successfully";
    }

    @Override
    public UserResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Email"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getSpecialization()
        );
    }
}