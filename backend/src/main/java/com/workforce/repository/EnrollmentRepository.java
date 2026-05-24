package com.workforce.repository;

import com.workforce.entity.Enrollment;
import com.workforce.enums.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findBySeekerSeekerID(Long seekerID);

    List<Enrollment> findByProgramProgramID(Long programID);

    Enrollment findBySeekerSeekerIDAndProgramProgramID(Long seekerID, Long programID);

    long countByStatus(EnrollmentStatus status);
}