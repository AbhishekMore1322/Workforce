package com.workforce.controller;

import com.workforce.api.APIResponse;
import com.workforce.dto.TrainingProgramRequest;
import com.workforce.dto.TrainingProgramResponse;
import com.workforce.service.TrainingProgramService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/training-programs")
@RequiredArgsConstructor
public class TrainingProgramController {

    private final TrainingProgramService service;

    @PostMapping
    public ResponseEntity<APIResponse<TrainingProgramResponse>> create(
            @Valid @RequestBody TrainingProgramRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.<TrainingProgramResponse>builder()
                        .status("SUCCESS")
                        .message("Training program created successfully")
                        .data(service.create(request))
                        .build());
    }

    @GetMapping
    public ResponseEntity<APIResponse<List<TrainingProgramResponse>>> list() {

        return ResponseEntity.ok(APIResponse.<List<TrainingProgramResponse>>builder()
                .status("SUCCESS")
                .message("Training programs fetched")
                .data(service.getAll())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<TrainingProgramResponse>> get(@PathVariable Long id) {

        return ResponseEntity.ok(APIResponse.<TrainingProgramResponse>builder()
                .status("SUCCESS")
                .message("Training program details fetched")
                .data(service.getById(id))
                .build());
    }

    @PatchMapping("/{id}")
    public ResponseEntity<APIResponse<TrainingProgramResponse>> updateStatus(
            @PathVariable Long id) {

        return ResponseEntity.ok(APIResponse.<TrainingProgramResponse>builder()
                .status("SUCCESS")
                .message("Training program deactivated")
                .data(service.update(id))
                .build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> delete(@PathVariable Long id) {

        service.delete(id);

        return ResponseEntity.ok(
                APIResponse.<Void>builder()
                        .status("SUCCESS")
                        .message("Training program deleted successfully")
                        .data(null)
                        .build()
        );
    }
}
