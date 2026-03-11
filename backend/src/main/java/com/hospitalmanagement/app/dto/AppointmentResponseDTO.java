package com.hospitalmanagement.app.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

import com.hospitalmanagement.app.entity.AppointmentStatus;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AppointmentResponseDTO {

    private Long id;

    private Long patientId;
    private String patientName;

    private Long doctorId;
    private String doctorName;

    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private AppointmentStatus status;
    private double fee;

    private LocalDateTime createdAt;
}