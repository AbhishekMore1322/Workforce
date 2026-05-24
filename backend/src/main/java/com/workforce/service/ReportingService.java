package com.workforce.service;

import com.workforce.dto.*;

public interface ReportingService {

    JobApplicationReportResponse jobApplicationReport();
    PlacementReportResponse placementReport();
    TrainingReportResponse trainingReport();
    EmployerReportResponse employerReport();
    ComplianceReportResponse complianceReport();
}