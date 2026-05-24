package com.workforce.repository;

import com.workforce.entity.AuthUser;
import com.workforce.entity.Employer;
import com.workforce.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployerRepository extends JpaRepository<Employer, Long> {

 
    boolean existsByUser(AuthUser user);
 
    Employer findByUser_Username(String username);
    

    long countByStatus(Status status);
}