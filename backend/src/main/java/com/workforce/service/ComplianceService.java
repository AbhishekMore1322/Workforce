package com.workforce.service;

import com.workforce.dto.*;

import java.util.List;

public interface ComplianceService {

    ComplianceRecordResponse checkCompliance(ComplianceCheckRequest request);
    List<ComplianceRecordResponse> getComplianceReports();
}
