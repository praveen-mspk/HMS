package com.hospitalmanagement.app.service.impl;

import com.hospitalmanagement.app.dto.AvailableSlotRequestDTO;
import com.hospitalmanagement.app.entity.*;
import com.hospitalmanagement.app.entity.AppointmentStatus;
import com.hospitalmanagement.app.repository.*;
import com.hospitalmanagement.app.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final UserRepository userRepository;
    private final AvailableSlotRepository slotRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public List<AvailableSlot> addAvailableSlot(Long doctorId, AvailableSlotRequestDTO dto) {

        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        java.time.LocalTime currentStart = dto.getStartTime();
        java.time.LocalTime end = dto.getEndTime();
        java.util.List<AvailableSlot> createdSlots = new java.util.ArrayList<>();

        // Loop and split into 20-minute chunks
        while (currentStart.plusMinutes(20).isBefore(end) || currentStart.plusMinutes(20).equals(end)) {
            AvailableSlot slot = new AvailableSlot();
            slot.setDoctor(doctor);
            slot.setDate(dto.getDate());
            slot.setStartTime(currentStart);
            slot.setEndTime(currentStart.plusMinutes(20));
            
            createdSlots.add(slotRepository.save(slot));
            
            currentStart = currentStart.plusMinutes(20);
        }

        return createdSlots;
    }

    @Override
    public List<Appointment> getDoctorAppointments(Long doctorId) {

        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return appointmentRepository.findByDoctor(doctor);
    }

    @Override
    public String confirmAppointment(Long appointmentId) {

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appointment);

        return "Appointment Confirmed";
    }
}