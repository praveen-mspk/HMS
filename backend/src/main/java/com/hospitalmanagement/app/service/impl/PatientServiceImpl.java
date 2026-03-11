package com.hospitalmanagement.app.service.impl;

import com.hospitalmanagement.app.entity.User;
import com.hospitalmanagement.app.repository.AppointmentRepository;
import com.hospitalmanagement.app.repository.UserRepository;
import com.hospitalmanagement.app.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public Object getPatientAppointments(Long patientId) {

        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return appointmentRepository.findByPatient(patient);
    }
}
