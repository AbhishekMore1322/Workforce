package com.workforce.controller;

import com.workforce.api.APIResponse;
import com.workforce.dto.*;
import com.workforce.service.AuditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/audits")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService service;

    @PostMapping("/create")
    public APIResponse<AuditResponse> create(@Valid @RequestBody AuditRequest request) {

        return APIResponse.<AuditResponse>builder()
                .status("SUCCESS")
                .message("Audit created successfully")
                .data(service.createAudit(request))
                .build();
    }

    @GetMapping
    public APIResponse<List<AuditResponse>> list() {

        return APIResponse.<List<AuditResponse>>builder()
                .status("SUCCESS")
                .message("Audits fetched")
                .data(service.getAllAudits())
                .build();
    }

    @GetMapping("/{id}")
    public APIResponse<AuditResponse> get(@PathVariable Long id) {

        return APIResponse.<AuditResponse>builder()
                .status("SUCCESS")
                .message("Audit details fetched")
                .data(service.getAuditById(id))
                .build();
    }
}
