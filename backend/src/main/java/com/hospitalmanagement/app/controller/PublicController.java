package com.hospitalmanagement.app.controller;

import com.hospitalmanagement.app.entity.Role;
import com.hospitalmanagement.app.entity.User;
import com.hospitalmanagement.app.repository.UserRepository;
import com.hospitalmanagement.app.repository.AvailableSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PublicController {

    private final UserRepository userRepository;
    private final AvailableSlotRepository slotRepository;

    @GetMapping("/specializations")
    public ResponseEntity<List<String>> getSpecializations() {
        return ResponseEntity.ok(userRepository.findDistinctSpecializations());
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getDoctors(@RequestParam(required = false) String specialization) {
        if (specialization != null && !specialization.isEmpty()) {
            return ResponseEntity.ok(userRepository.findByRoleAndSpecialization(Role.DOCTOR, specialization));
        }
        return ResponseEntity.ok(userRepository.findByRole(Role.DOCTOR));
    }

    private final com.hospitalmanagement.app.repository.AppointmentRepository appointmentRepository;

    @GetMapping("/doctors/{doctorId}/slots")
    public ResponseEntity<?> getDoctorSlots(@PathVariable Long doctorId) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        // Fetch all slots defined for the doctor
        List<com.hospitalmanagement.app.entity.AvailableSlot> allSlots = slotRepository.findByDoctor(doctor);
        
        // Fetch all non-cancelled appointments for the doctor
        List<com.hospitalmanagement.app.entity.Appointment> appointments = appointmentRepository.findByDoctor(doctor)
                .stream()
                .filter(a -> !a.getStatus().equals(com.hospitalmanagement.app.entity.AppointmentStatus.CANCELLED))
                .collect(java.util.stream.Collectors.toList());

        // Filter out slots that match an existing appointment's date and start time
        List<com.hospitalmanagement.app.entity.AvailableSlot> availableSlots = allSlots.stream()
                .filter(slot -> appointments.stream().noneMatch(appt -> 
                    appt.getAppointmentDate().equals(slot.getDate()) && 
                    appt.getStartTime().equals(slot.getStartTime())
                ))
                .collect(java.util.stream.Collectors.toList());

        return ResponseEntity.ok(availableSlots);
    }
}
