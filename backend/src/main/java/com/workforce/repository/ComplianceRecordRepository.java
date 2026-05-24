package com.workforce.repository;

import com.workforce.entity.ComplianceRecord;
import com.workforce.enums.ComplianceResult;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplianceRecordRepository extends JpaRepository<ComplianceRecord, Long> {
	long countByResult(ComplianceResult result);
}
