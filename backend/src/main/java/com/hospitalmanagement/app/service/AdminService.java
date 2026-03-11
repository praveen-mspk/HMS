// package com.hospitalmanagement.app.service;

// public class AdminService {
    
// }
package com.hospitalmanagement.app.service;

import com.hospitalmanagement.app.dto.AdminDTO;
import com.hospitalmanagement.app.entity.Admin;

import java.util.List;

public interface AdminService {

    Admin registerAdmin(AdminDTO adminDTO);

    List<Admin> getAllAdmins();

    Admin getAdminByEmail(String email);
}