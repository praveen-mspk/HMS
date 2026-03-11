// package com.hospitalmanagement.app.repository;

// public class AdminRepository {
    
// }

package com.hospitalmanagement.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hospitalmanagement.app.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Admin findByEmail(String email);
}
