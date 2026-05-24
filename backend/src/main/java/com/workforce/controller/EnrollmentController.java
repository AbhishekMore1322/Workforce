package com.workforce.controller;

import com.workforce.api.APIResponse;
import com.workforce.dto.EnrollmentRequest;
import com.workforce.dto.EnrollmentResponse;
import com.workforce.service.EnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService service;

    @PostMapping("/training-programs/{id}/enroll")
    public ResponseEntity<APIResponse<EnrollmentResponse>> enroll(
            @PathVariable Long id,
            @Valid @RequestBody EnrollmentRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.<EnrollmentResponse>builder()
                        .status("SUCCESS")
                        .message("Enrollment successful")
                        .data(service.enroll(id, request))
                        .build());
    }

    @GetMapping("/enrollments/jobseeker/{id}")
    public ResponseEntity<APIResponse<List<EnrollmentResponse>>> bySeeker(@PathVariable Long id) {

        return ResponseEntity.ok(APIResponse.<List<EnrollmentResponse>>builder()
                .status("SUCCESS")
                .message("Enrollments fetched for job seeker")
                .data(service.getBySeeker(id))
                .build());
    }

    @GetMapping("/enrollments/program/{id}")
    public ResponseEntity<APIResponse<List<EnrollmentResponse>>> byProgram(@PathVariable Long id) {

        return ResponseEntity.ok(APIResponse.<List<EnrollmentResponse>>builder()
                .status("SUCCESS")
                .message("Program enrollments fetched")
                .data(service.getByProgram(id))
                .build());
    }

    @PatchMapping("/enrollments/{id}/status")
    public ResponseEntity<APIResponse<EnrollmentResponse>> status(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(APIResponse.<EnrollmentResponse>builder()
                .status("SUCCESS")
                .message("Enrollment status updated")
                .data(service.updateStatus(id, status))
                .build());
    }
}