package com.workforce.controller;

import com.workforce.api.APIResponse;
import com.workforce.dto.*;
import com.workforce.service.EmployerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employers")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService service;

    @PostMapping("/register")
    public ResponseEntity<APIResponse<EmployerResponse>> register(
            @Valid @RequestBody EmployerRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.<EmployerResponse>builder()
                        .status("SUCCESS")
                        .message("Employer registered")
                        .data(service.register(request))
                        .build());
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<EmployerResponse>>> list() {

        return ResponseEntity.ok(APIResponse.<List<EmployerResponse>>builder()
                .status("SUCCESS")
                .message("Employers fetched")
                .data(service.getAll())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<EmployerResponse>> get(@PathVariable Long id) {

        return ResponseEntity.ok(APIResponse.<EmployerResponse>builder()
                .status("SUCCESS")
                .message("Employer details fetched")
                .data(service.getById(id))
                .build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<APIResponse<EmployerResponse>> status(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(APIResponse.<EmployerResponse>builder()
                .status("SUCCESS")
                .message("Employer status updated")
                .data(service.updateStatus(id, status))
                .build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> delete(@PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(
                APIResponse.<Void>builder()
                        .status("SUCCESS")
                        .message("Employer deleted successfully")
                        .data(null)
                        .build()
        );
}}