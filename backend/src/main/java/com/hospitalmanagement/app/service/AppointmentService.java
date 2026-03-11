package com.hospitalmanagement.app.service;

import com.hospitalmanagement.app.dto.AppointmentRequestDTO;
import com.hospitalmanagement.app.dto.AppointmentResponseDTO;

import java.util.List;

public interface AppointmentService {

    AppointmentResponseDTO createAppointment(AppointmentRequestDTO dto, String patientEmail);

    List<AppointmentResponseDTO> getAppointments(String email, String role);

    AppointmentResponseDTO getAppointmentById(Long id, String callerEmail, String role);
    AppointmentResponseDTO cancelAppointment(Long id);
}