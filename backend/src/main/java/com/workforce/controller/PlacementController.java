package com.workforce.controller;

import com.workforce.api.APIResponse;
import com.workforce.dto.PlacementRequest;
import com.workforce.dto.PlacementResponse;
import com.workforce.service.PlacementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/placements")
@RequiredArgsConstructor
public class PlacementController {

    private final PlacementService service;

    @PostMapping("/create")
    public ResponseEntity<APIResponse<PlacementResponse>> create(
            @Valid @RequestBody PlacementRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.<PlacementResponse>builder()
                        .status("SUCCESS")
                        .message("Placement created successfully")
                        .data(service.create(request))
                        .build());
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<PlacementResponse>>> list() {
        return ResponseEntity.ok(
                APIResponse.<List<PlacementResponse>>builder()
                        .status("SUCCESS")
                        .message("Placements fetched")
                        .data(service.getAll())
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<PlacementResponse>> get(@PathVariable Long id) {
        return ResponseEntity.ok(
                APIResponse.<PlacementResponse>builder()
                        .status("SUCCESS")
                        .message("Placement details fetched")
                        .data(service.getById(id))
                        .build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<APIResponse<PlacementResponse>> status(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                APIResponse.<PlacementResponse>builder()
                        .status("SUCCESS")
                        .message("Placement status updated")
                        .data(service.updateStatus(id, status))
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(
                APIResponse.<Void>builder()
                        .status("SUCCESS")
                        .message("Placement deleted successfully")
                        .data(null)
                        .build());
    }
}
