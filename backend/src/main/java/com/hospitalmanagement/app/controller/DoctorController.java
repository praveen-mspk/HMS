package com.hospitalmanagement.app.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hospitalmanagement.app.dto.AvailableSlotRequestDTO;
import com.hospitalmanagement.app.service.DoctorService;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping("/{doctorId}/slots")
    public ResponseEntity<?> addSlot(
            @PathVariable Long doctorId,
            @RequestBody AvailableSlotRequestDTO dto) {

        return ResponseEntity.ok(
                doctorService.addAvailableSlot(doctorId, dto));
    }

    @GetMapping("/{doctorId}/appointments")
    public ResponseEntity<?> getDoctorAppointments(
            @PathVariable Long doctorId) {

        return ResponseEntity.ok(
                doctorService.getDoctorAppointments(doctorId));
    }

    @PutMapping("/appointments/{appointmentId}/confirm")
    public ResponseEntity<?> confirmAppointment(
            @PathVariable Long appointmentId) {

        return ResponseEntity.ok(
                doctorService.confirmAppointment(appointmentId));
    }
}