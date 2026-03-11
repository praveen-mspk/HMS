package com.hospitalmanagement.app.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospitalmanagement.app.dto.AppointmentRequestDTO;
import com.hospitalmanagement.app.dto.AppointmentResponseDTO;
import com.hospitalmanagement.app.entity.Appointment;
import com.hospitalmanagement.app.entity.AppointmentStatus;
import com.hospitalmanagement.app.entity.Role;
import com.hospitalmanagement.app.entity.User;
import com.hospitalmanagement.app.repository.AppointmentRepository;
import com.hospitalmanagement.app.repository.UserRepository;
import com.hospitalmanagement.app.service.AppointmentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository        userRepository;

    //Create 

    @Override
    @Transactional
    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO dto, String patientEmail) {

        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        User doctor = userRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found: " + dto.getDoctorId()));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("Selected user is not a doctor.");
        }

        // Use existing findOverlappingAppointments — more robust than existsBy check
        // catches partial time overlaps, not just exact startTime matches
        List<Appointment> overlaps = appointmentRepository.findOverlappingAppointments(
                doctor,
                dto.getAppointmentDate(),
                dto.getStartTime(),
                dto.getEndTime()
        );

        if (!overlaps.isEmpty()) {
            throw new RuntimeException("This slot is already booked. Please choose a different time.");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setStartTime(dto.getStartTime());
        appointment.setEndTime(dto.getEndTime());
        appointment.setStatus(AppointmentStatus.BOOKED);
        appointment.setFee(0.0);

        return toResponse(appointmentRepository.save(appointment));
    }

    //Read

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDTO> getAppointments(String email, String role) {

        String upperRole = role.toUpperCase();

        if (upperRole.equals("ADMIN") || upperRole.equals("ROLE_ADMIN")) {
            return appointmentRepository.findAll().stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Appointment> appointments = switch (upperRole) {
            case "ROLE_PATIENT", "PATIENT" -> appointmentRepository.findByPatient(user);
            case "ROLE_DOCTOR", "DOCTOR"   -> appointmentRepository.findByDoctor(user);
            default -> throw new RuntimeException("Unknown role: " + role);
        };

        return appointments.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentResponseDTO getAppointmentById(Long id, String callerEmail, String role) {

        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));

        boolean isAdmin   = role.equalsIgnoreCase("ROLE_ADMIN") || role.equalsIgnoreCase("ADMIN");
        boolean isPatient = appt.getPatient().getEmail().equals(callerEmail);
        boolean isDoctor  = appt.getDoctor().getEmail().equals(callerEmail);

        if (!isAdmin && !isPatient && !isDoctor) {
            throw new AccessDeniedException("You do not have permission to view this appointment.");
        }

        return toResponse(appt);
    }

    @Override
    @Transactional
    public AppointmentResponseDTO cancelAppointment(Long id) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));
        appt.setStatus(AppointmentStatus.CANCELLED);
        return toResponse(appointmentRepository.save(appt));
    }

    //Mapper 

    private AppointmentResponseDTO toResponse(Appointment a) {
        return new AppointmentResponseDTO(
                a.getId(),
                a.getPatient().getId(),
                a.getPatient().getName(),
                a.getDoctor().getId(),
                a.getDoctor().getName(),
                a.getAppointmentDate(),
                a.getStartTime(),
                a.getEndTime(),
                a.getStatus(),
                a.getFee(),
                a.getCreatedAt()
        );
    }
}