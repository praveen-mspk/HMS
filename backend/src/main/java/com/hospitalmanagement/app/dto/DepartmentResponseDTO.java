package com.hospitalmanagement.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DepartmentResponseDTO {

    private Long id;
    private String name;
    private double consultationFee;
}