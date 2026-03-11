package com.hospitalmanagement.app.controller;

import com.hospitalmanagement.app.dto.AppointmentRequestDTO;
import com.hospitalmanagement.app.dto.AppointmentResponseDTO;
import com.hospitalmanagement.app.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    //POST /api/appointments
    @PostMapping
    public ResponseEntity<AppointmentResponseDTO> createAppointment(
            @RequestBody AppointmentRequestDTO request,
            @RequestHeader("X-User-Email") String email
    ) {
        AppointmentResponseDTO response = appointmentService.createAppointment(request, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //GET /api/appointments
    @GetMapping
    public ResponseEntity<List<AppointmentResponseDTO>> getAppointments(
            @RequestHeader("X-User-Email") String email,
            @RequestHeader("X-User-Role") String role
    ) {
        List<AppointmentResponseDTO> response = appointmentService.getAppointments(email, role);
        return ResponseEntity.ok(response);
    }

    //GET /api/appointments/{id}
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDTO> getAppointmentById(
            @PathVariable Long id,
            @RequestHeader("X-User-Email") String email,
            @RequestHeader("X-User-Role") String role
    ) {
        AppointmentResponseDTO response = appointmentService.getAppointmentById(id, email, role);
        return ResponseEntity.ok(response);
    }

    //PUT /api/appointments/{id}/cancel
    @PutMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponseDTO> cancelAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }
}