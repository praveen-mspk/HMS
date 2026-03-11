package com.hospitalmanagement.app.controller;

import com.hospitalmanagement.app.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/{patientId}/appointments")
    public ResponseEntity<?> getMyAppointments(
            @PathVariable Long patientId) {

        return ResponseEntity.ok(
                patientService.getPatientAppointments(patientId));
    }
}
