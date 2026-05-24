package com.workforce.repository;

import com.workforce.entity.JobPosting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {

    @Query("""
        SELECT j FROM JobPosting j
        WHERE j.status = 'OPEN'
          AND (
            LOWER(j.title)            LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(j.description)      LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(j.location)         LIKE LOWER(CONCAT('%', :keyword, '%')) OR
            LOWER(j.requirementsJSON) LIKE LOWER(CONCAT('%', :keyword, '%'))
          )
    """)
    List<JobPosting> searchByKeyword(@Param("keyword") String keyword);
}
