package com.workforce.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.api.APIResponse;
import com.workforce.dto.ComplianceReportResponse;
import com.workforce.dto.EmployerReportResponse;
import com.workforce.dto.JobApplicationReportResponse;
import com.workforce.dto.PlacementReportResponse;
import com.workforce.dto.TrainingReportResponse;
import com.workforce.service.ReportingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportingController {

    private final ReportingService reportingService;

    @GetMapping("/job-applications")
    public APIResponse<JobApplicationReportResponse> jobApplications() {
        return APIResponse.<JobApplicationReportResponse>builder()
                .status("SUCCESS")
                .message("Job application analytics generated")
                .data(reportingService.jobApplicationReport())
                .build();
    }

    @GetMapping("/placements")
    public APIResponse<PlacementReportResponse> placements() {
        return APIResponse.<PlacementReportResponse>builder()
                .status("SUCCESS")
                .message("Placement analytics generated")
                .data(reportingService.placementReport())
                .build();
    }

    @GetMapping("/training")
    public APIResponse<TrainingReportResponse> training() {
        return APIResponse.<TrainingReportResponse>builder()
                .status("SUCCESS")
                .message("Training program analytics generated")
                .data(reportingService.trainingReport())
                .build();
    }

    @GetMapping("/employers")
    public APIResponse<EmployerReportResponse> employers() {
        return APIResponse.<EmployerReportResponse>builder()
                .status("SUCCESS")
                .message("Employer analytics generated")
                .data(reportingService.employerReport())
                .build();
    }

    @GetMapping("/compliance")
    public APIResponse<ComplianceReportResponse> compliance() {
        return APIResponse.<ComplianceReportResponse>builder()
                .status("SUCCESS")
                .message("Compliance analytics generated")
                .data(reportingService.complianceReport())
                .build();
    }
}