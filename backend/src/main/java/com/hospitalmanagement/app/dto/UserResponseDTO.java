package com.hospitalmanagement.app.dto;

import com.hospitalmanagement.app.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDTO {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private String specialization;
}