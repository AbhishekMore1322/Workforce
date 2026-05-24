package com.workforce.controller;

import com.workforce.api.APIResponse;
import com.workforce.dto.*;
import com.workforce.service.JobSeekerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobseekers")
@RequiredArgsConstructor
public class JobSeekerController {

    private final JobSeekerService service;

    @PostMapping("/register")
    public ResponseEntity<APIResponse<JobSeekerResponse>> register(
            @Valid @RequestBody JobSeekerRequest request) {

        return ResponseEntity.ok(APIResponse.<JobSeekerResponse>builder()
                .status("SUCCESS")
                .message("Job seeker registered")
                .data(service.register(request))
                .build());
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<JobSeekerResponse>>> list() {

        return ResponseEntity.ok(APIResponse.<List<JobSeekerResponse>>builder()
                .status("SUCCESS")
                .message("Job seekers fetched")
                .data(service.getAll())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<JobSeekerResponse>> get(@PathVariable Long id) {

        return ResponseEntity.ok(APIResponse.<JobSeekerResponse>builder()
                .status("SUCCESS")
                .message("Job seeker fetched")
                .data(service.getById(id))
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<JobSeekerResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody JobSeekerRequest request) {

        return ResponseEntity.ok(APIResponse.<JobSeekerResponse>builder()
                .status("SUCCESS")
                .message("Job seeker updated")
                .data(service.update(id, request))
                .build());
    }

    @PatchMapping("/{id}/skills")
    public ResponseEntity<APIResponse<JobSeekerResponse>> updateSkills(
            @PathVariable Long id,
            @Valid @RequestBody SkillsUpdateRequest request) {

        return ResponseEntity.ok(APIResponse.<JobSeekerResponse>builder()
                .status("SUCCESS")
                .message("Skills updated")
                .data(service.updateSkills(id, request.getSkillsJSON()))
                .build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<APIResponse<JobSeekerResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(APIResponse.<JobSeekerResponse>builder()
                .status("SUCCESS")
                .message("Status updated")
                .data(service.updateStatus(id, status))
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> delete(@PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(APIResponse.<Void>builder()
                .status("SUCCESS")
                .message("Job seeker deactivated")
                .data(null)
                .build());
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<APIResponse<List<ApplicationResponse>>> applications(
            @PathVariable Long id) {

        return ResponseEntity.ok(APIResponse.<List<ApplicationResponse>>builder()
                .status("SUCCESS")
                .message("Applications fetched")
                .data(service.getApplications(id))
                .build());
    }
}