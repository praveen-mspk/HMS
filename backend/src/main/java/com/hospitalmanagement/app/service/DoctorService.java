package com.hospitalmanagement.app.service;

import com.hospitalmanagement.app.dto.AvailableSlotRequestDTO;
import com.hospitalmanagement.app.entity.AvailableSlot;
import com.hospitalmanagement.app.entity.Appointment;
import java.util.List;

public interface DoctorService {

    List<AvailableSlot> addAvailableSlot(Long doctorId, AvailableSlotRequestDTO dto);

    List<Appointment> getDoctorAppointments(Long doctorId);

    String confirmAppointment(Long appointmentId);
}