package com.workforce.controller;

import com.workforce.api.APIResponse;
import com.workforce.dto.*;
import com.workforce.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService service;

    @PostMapping("/apply")
    public ResponseEntity<APIResponse<ApplicationResponse>> apply(
            @Valid @RequestBody ApplicationRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.<ApplicationResponse>builder()
                        .status("SUCCESS")
                        .message("Application submitted successfully")
                        .data(service.apply(request))
                        .build());
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<ApplicationResponse>>> list() {

        return ResponseEntity.ok(APIResponse.<List<ApplicationResponse>>builder()
                .status("SUCCESS")
                .message("Applications fetched")
                .data(service.getAll())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<ApplicationResponse>> get(@PathVariable Long id) {

        return ResponseEntity.ok(APIResponse.<ApplicationResponse>builder()
                .status("SUCCESS")
                .message("Application details fetched")
                .data(service.getById(id))
                .build());
    }

    @GetMapping("/jobseeker/{id}")
    public ResponseEntity<APIResponse<List<ApplicationResponse>>> bySeeker(@PathVariable Long id) {

        return ResponseEntity.ok(APIResponse.<List<ApplicationResponse>>builder()
                .status("SUCCESS")
                .message("Job seeker applications fetched")
                .data(service.getBySeeker(id))
                .build());
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<APIResponse<List<ApplicationResponse>>> byJob(@PathVariable Long jobId) {

        return ResponseEntity.ok(APIResponse.<List<ApplicationResponse>>builder()
                .status("SUCCESS")
                .message("Job applications fetched")
                .data(service.getByJob(jobId))
                .build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<APIResponse<ApplicationResponse>> status(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(APIResponse.<ApplicationResponse>builder()
                .status("SUCCESS")
                .message("Application status updated")
                .data(service.updateStatus(id, status))
                .build());
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<APIResponse<Void>> notes(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationNoteRequest request) {

        service.addNote(id, request);
        return ResponseEntity.ok(APIResponse.<Void>builder()
                .status("SUCCESS")
                .message("Note added successfully")
                .data(null)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> withdraw(@PathVariable Long id) {

        service.withdraw(id);
        return ResponseEntity.ok(APIResponse.<Void>builder()
                .status("SUCCESS")
                .message("Application withdrawn successfully")
                .data(null)
                .build());
    }
}
