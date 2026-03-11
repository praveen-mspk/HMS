package com.hospitalmanagement.app.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hospitalmanagement.app.entity.Appointment;
import com.hospitalmanagement.app.entity.AppointmentStatus;
import com.hospitalmanagement.app.entity.User;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctor(User doctor);

    List<Appointment> findByPatient(User patient);

    List<Appointment> findByDoctorAndAppointmentDate(
            User doctor, LocalDate date);

    @Query("""
                SELECT a FROM Appointment a
                WHERE a.doctor = :doctor
                AND a.appointmentDate = :date
                AND a.status <> 'CANCELLED'
                AND (
                    (:startTime < a.endTime AND :endTime > a.startTime)
                )
            """)
    List<Appointment> findOverlappingAppointments(
            User doctor,
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime);

    long countByDoctor(User doctor);

    @Query("""
                SELECT COUNT(a)
                FROM Appointment a
                WHERE a.doctor.department.id = :departmentId
            """)
    long countAppointmentsByDepartment(Long departmentId);

    @Query("""
                SELECT SUM(a.fee)
                FROM Appointment a
                WHERE a.doctor.department.id = :departmentId
                AND a.status = 'COMPLETED'
            """)
    Double calculateRevenueByDepartment(Long departmentId);

    List<Appointment> findByStatus(AppointmentStatus status);
}
