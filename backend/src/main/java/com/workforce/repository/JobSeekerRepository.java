package com.workforce.repository;

import com.workforce.entity.AuthUser;
import com.workforce.entity.JobSeeker;
import com.workforce.enums.Status;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JobSeekerRepository extends JpaRepository<JobSeeker, Long> {

	boolean existsByUser(AuthUser user);
	
	JobSeeker findByUser_Username(String username);
    
    List<JobSeeker> findByStatus(Status status);
}