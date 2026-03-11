// package com.hospitalmanagement.app.service.impl;

// public class AdminServiceImpl {
    
// }

package com.hospitalmanagement.app.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hospitalmanagement.app.dto.AdminDTO;
import com.hospitalmanagement.app.entity.Admin;
import com.hospitalmanagement.app.repository.AdminRepository;
import com.hospitalmanagement.app.service.AdminService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Admin registerAdmin(AdminDTO adminDTO) {

        Admin admin = new Admin();
        admin.setName(adminDTO.getName());
        admin.setEmail(adminDTO.getEmail());
        admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));

        return adminRepository.save(admin);
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public Admin getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }
}
