package com.workforce.repository;

import com.workforce.entity.Application;
import com.workforce.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findBySeekerSeekerID(Long seekerID);

    List<Application> findByJobJobID(Long jobID);

    Optional<Application> findBySeekerSeekerIDAndJobJobID(Long seekerID, Long jobID);

    long countByStatus(ApplicationStatus status);
}