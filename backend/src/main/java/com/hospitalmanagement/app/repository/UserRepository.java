package com.hospitalmanagement.app.repository;

import com.hospitalmanagement.app.entity.Role;
import com.hospitalmanagement.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleAndDepartmentId(Role role, Long departmentId);

    @Query("SELECT DISTINCT u.specialization FROM User u WHERE u.role = 'DOCTOR' AND u.specialization IS NOT NULL")
    List<String> findDistinctSpecializations();

    @Query("SELECT u FROM User u WHERE u.role = :role AND LOWER(u.specialization) = LOWER(:specialization)")
    List<User> findByRoleAndSpecialization(Role role, String specialization);
}
