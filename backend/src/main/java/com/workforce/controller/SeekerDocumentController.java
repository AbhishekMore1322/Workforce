package com.workforce.controller;

import com.workforce.api.APIResponse;
import com.workforce.dto.SeekerDocumentRequest;
import com.workforce.dto.SeekerDocumentResponse;
import com.workforce.service.SeekerDocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SeekerDocumentController {

    private final SeekerDocumentService service;

    @PostMapping("/jobseekers/{id}/documents")
    public ResponseEntity<APIResponse<SeekerDocumentResponse>> upload(
            @PathVariable Long id,
            @Valid @RequestBody SeekerDocumentRequest request) {

        return ResponseEntity.ok(APIResponse.<SeekerDocumentResponse>builder()
                .status("SUCCESS")
                .message("Document uploaded successfully")
                .data(service.upload(id, request))
                .build());
    }

    @GetMapping("/jobseekers/{id}/documents")
    public ResponseEntity<APIResponse<List<SeekerDocumentResponse>>> getAll(
            @PathVariable Long id) {

        return ResponseEntity.ok(APIResponse.<List<SeekerDocumentResponse>>builder()
                .status("SUCCESS")
                .message("Documents fetched successfully")
                .data(service.getBySeeker(id))
                .build());
    }

    @DeleteMapping("/jobseekers/{seekerId}/documents/{docId}")
    public ResponseEntity<APIResponse<Void>> delete(
            @PathVariable Long seekerId,
            @PathVariable Long docId) {

        service.delete(seekerId, docId);

        return ResponseEntity.ok(APIResponse.<Void>builder()
                .status("SUCCESS")
                .message("Document deleted successfully")
                .data(null)
                .build());
    }
    @GetMapping("/jobseekers/{id}/documents/resume/latest")
    public ResponseEntity<APIResponse<String>> getLatestResume(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                APIResponse.<String>builder()
                        .status("SUCCESS")
                        .message("Latest resume fetched successfully")
                        .data(service.getLatestResume(id))  
                        .build()
        );
    }
}
