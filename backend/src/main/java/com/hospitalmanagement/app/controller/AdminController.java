
package com.hospitalmanagement.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.hospitalmanagement.app.dto.AdminDTO;
import com.hospitalmanagement.app.entity.Admin;
import com.hospitalmanagement.app.service.AdminService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public Admin registerAdmin(@RequestBody AdminDTO adminDTO) {
        return adminService.registerAdmin(adminDTO);
    }

    @GetMapping("/all")
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @GetMapping("/{email}")
    public Admin getAdminByEmail(@PathVariable String email) {
        return adminService.getAdminByEmail(email);
    }
}
