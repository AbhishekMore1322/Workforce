package com.workforce.repository;

import com.workforce.entity.ApplicationUpdate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationUpdateRepository extends JpaRepository<ApplicationUpdate, Long> {
}