package com.workforce.controller;

import com.workforce.api.APIResponse;
import com.workforce.dto.*;
import com.workforce.service.ComplianceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/compliance")
@RequiredArgsConstructor
public class ComplianceController {

    private final ComplianceService service;

    @PostMapping("/check")
    public APIResponse<ComplianceRecordResponse> check(@Valid @RequestBody ComplianceCheckRequest request) {

        return APIResponse.<ComplianceRecordResponse>builder()
                .status("SUCCESS")
                .message("Compliance check completed")
                .data(service.checkCompliance(request))
                .build();
    }

    @GetMapping("/reports")
    public APIResponse<List<ComplianceRecordResponse>> reports() {

        return APIResponse.<List<ComplianceRecordResponse>>builder()
                .status("SUCCESS")
                .message("Compliance reports fetched")
                .data(service.getComplianceReports())
                .build();
    }
}