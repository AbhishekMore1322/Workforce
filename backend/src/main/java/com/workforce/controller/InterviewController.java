package com.workforce.controller;

import com.workforce.api.APIResponse;
import com.workforce.dto.*;
import com.workforce.service.InterviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService service;

    @PostMapping("/schedule")
    public ResponseEntity<APIResponse<InterviewResponse>> schedule(
            @Valid @RequestBody InterviewRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.<InterviewResponse>builder()
                        .status("SUCCESS")
                        .message("Interview scheduled successfully")
                        .data(service.schedule(request))
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<InterviewResponse>> get(@PathVariable Long id) {

        return ResponseEntity.ok(APIResponse.<InterviewResponse>builder()
                .status("SUCCESS")
                .message("Interview details fetched")
                .data(service.getById(id))
                .build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<APIResponse<InterviewResponse>> status(
            @PathVariable Long id,
            @RequestBody InterviewStatusUpdateRequest request) {

        return ResponseEntity.ok(
                APIResponse.<InterviewResponse>builder()
                        .status("SUCCESS")
                        .message("Interview completed with result")
                        .data(service.updateStatus(id, request))
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> delete(@PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(
                APIResponse.<Void>builder()
                        .status("SUCCESS")
                        .message("Interview deleted successfully")
                        .data(null)
                        .build()
        );
    }

   
    @GetMapping("/employer/me")
    public ResponseEntity<APIResponse<List<InterviewResponse>>> getMyInterviews() {

        return ResponseEntity.ok(
                APIResponse.<List<InterviewResponse>>builder()
                        .status("SUCCESS")
                        .message("Employer interviews fetched")
                        .data(service.getByCurrentEmployer())
                        .build()
        );
    }
}
