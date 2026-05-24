package com.workforce.controller;

import com.workforce.api.APIResponse;
import com.workforce.dto.*;
import com.workforce.enums.JobStatus;
import com.workforce.service.JobPostingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService service;

    @PostMapping
    public ResponseEntity<APIResponse<JobPostingResponse>> create(
            @Valid @RequestBody JobPostingRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.<JobPostingResponse>builder()
                        .status("SUCCESS")
                        .message("Job created")
                        .data(service.create(request))
                        .build());
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<JobPostingResponse>>> list() {

        return ResponseEntity.ok(APIResponse.<List<JobPostingResponse>>builder()
                .status("SUCCESS")
                .message("Jobs fetched")
                .data(service.getAll())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<JobPostingResponse>> get(@PathVariable Long id) {

        return ResponseEntity.ok(APIResponse.<JobPostingResponse>builder()
                .status("SUCCESS")
                .message("Job details fetched")
                .data(service.getById(id))
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<JobPostingResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody JobPostingRequest request) {

        return ResponseEntity.ok(APIResponse.<JobPostingResponse>builder()
                .status("SUCCESS")
                .message("Job updated")
                .data(service.update(id, request))
                .build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<APIResponse<JobPostingResponse>> status(
            @PathVariable Long id,
            @RequestParam JobStatus status) {

        return ResponseEntity.ok(APIResponse.<JobPostingResponse>builder()
                .status("SUCCESS")
                .message("Job status updated")
                .data(service.updateStatus(id, status))
                .build());
    }

    @GetMapping("/search")
    public ResponseEntity<APIResponse<List<JobPostingResponse>>> search(
            @RequestParam String keyword) {

        return ResponseEntity.ok(APIResponse.<List<JobPostingResponse>>builder()
                .status("SUCCESS")
                .message("Search results fetched")
                .data(service.search(keyword))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> delete(@PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(APIResponse.<Void>builder()
                .status("SUCCESS")
                .message("Job deleted")
                .data(null)
                .build());
    }
}
