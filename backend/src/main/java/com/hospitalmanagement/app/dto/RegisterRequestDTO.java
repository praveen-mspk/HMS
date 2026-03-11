package com.hospitalmanagement.app.dto;

import com.hospitalmanagement.app.entity.Role;
import lombok.Data;

@Data
public class RegisterRequestDTO {

    private String name;
    private String email;
    private String password;
    private String dob;
    private String gender;
    private String mobile;
    private Role role;              
    private String specialization;  
    private Long departmentId;
    private String departmentName;
}