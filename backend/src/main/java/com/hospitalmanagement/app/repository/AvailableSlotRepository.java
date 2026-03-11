package com.hospitalmanagement.app.repository;

import com.hospitalmanagement.app.entity.AvailableSlot;
import com.hospitalmanagement.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailableSlotRepository extends JpaRepository<AvailableSlot, Long> {
    List<AvailableSlot> findByDoctor(User doctor);
}
