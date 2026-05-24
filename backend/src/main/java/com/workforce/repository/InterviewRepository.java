package com.workforce.repository;

import com.workforce.entity.Application;
import com.workforce.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByApplicationApplicationID(Long applicationID);
    List<Interview> findByEmployerEmployerID(Long employerID);
	
    
}
