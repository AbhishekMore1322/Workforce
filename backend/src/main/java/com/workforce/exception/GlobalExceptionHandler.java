package com.workforce.exception;

import com.workforce.api.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ---------------- VALIDATION ERRORS ----------------

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return ResponseEntity.badRequest()
                .body(APIResponse.<Map<String, String>>builder()
                        .status("FAILED")
                        .message("Validation failed")
                        .data(errors)
                        .build());
    }

    // ---------------- NOT FOUND EXCEPTIONS ----------------

    @ExceptionHandler(DuplicateUserException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateUser(
            DuplicateUserException ex) {

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "status", "FAILURE",
                        "message", ex.getMessage()
                ));
    }


    @ExceptionHandler(JobSeekerNotFoundException.class)
    public ResponseEntity<APIResponse<String>> handleJobSeekerNotFound(JobSeekerNotFoundException ex) {
        return buildNotFoundResponse(ex.getMessage());
    }

    @ExceptionHandler(SeekerDocumentNotFoundException.class)
    public ResponseEntity<APIResponse<String>> handleDocumentNotFound(SeekerDocumentNotFoundException ex) {
        return buildNotFoundResponse(ex.getMessage());
    }

    @ExceptionHandler(EmployerNotFoundException.class)
    public ResponseEntity<APIResponse<String>> handleEmployerNotFound(EmployerNotFoundException ex) {
        return buildNotFoundResponse(ex.getMessage());
    }

    @ExceptionHandler(JobPostingNotFoundException.class)
    public ResponseEntity<APIResponse<String>> handleJobNotFound(JobPostingNotFoundException ex) {
        return buildNotFoundResponse(ex.getMessage());
    }

    @ExceptionHandler(ApplicationNotFoundException.class)
    public ResponseEntity<APIResponse<String>> handleApplicationNotFound(ApplicationNotFoundException ex) {
        return buildNotFoundResponse(ex.getMessage());
    }

    @ExceptionHandler(InterviewNotFoundException.class)
    public ResponseEntity<APIResponse<String>> handleInterviewNotFound(InterviewNotFoundException ex) {
        return buildNotFoundResponse(ex.getMessage());
    }

    @ExceptionHandler(PlacementNotFoundException.class)
    public ResponseEntity<APIResponse<String>> handlePlacementNotFound(PlacementNotFoundException ex) {
        return buildNotFoundResponse(ex.getMessage());
    }

    @ExceptionHandler(TrainingProgramNotFoundException.class)
    public ResponseEntity<APIResponse<String>> handleProgramNotFound(TrainingProgramNotFoundException ex) {
        return buildNotFoundResponse(ex.getMessage());
    }

    @ExceptionHandler(EnrollmentNotFoundException.class)
    public ResponseEntity<APIResponse<String>> handleEnrollmentNotFound(EnrollmentNotFoundException ex) {
        return buildNotFoundResponse(ex.getMessage());
    }

    // ---------------- MODULE 7: COMPLIANCE & AUDIT ----------------

    @ExceptionHandler(AuditNotFoundException.class)
    public ResponseEntity<APIResponse<String>> handleAuditNotFound(AuditNotFoundException ex) {
        return buildNotFoundResponse(ex.getMessage());
    }

    // ---------------- MODULE 9: NOTIFICATIONS ----------------

    @ExceptionHandler(NotificationNotFoundException.class)
    public ResponseEntity<APIResponse<String>> handleNotificationNotFound(NotificationNotFoundException ex) {
        return buildNotFoundResponse(ex.getMessage());
    }

    // ---------------- UNAUTHORIZED / BUSINESS ERRORS ----------------

    @ExceptionHandler(UnauthorizedOperationException.class)
    public ResponseEntity<APIResponse<String>> handleUnauthorized(UnauthorizedOperationException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(APIResponse.<String>builder()
                        .status("FAILED")
                        .message(ex.getMessage())
                        .data(null)
                        .build());
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<APIResponse<String>> handleIllegalArgument(
            IllegalArgumentException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(APIResponse.<String>builder()
                        .status("FAILED")
                        .message(ex.getMessage())
                        .data(null)
                        .build());
    }

    // ---------------- COMMON BUILDER ----------------

    private ResponseEntity<APIResponse<String>> buildNotFoundResponse(String message) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(APIResponse.<String>builder()
                        .status("FAILED")
                        .message(message)
                        .data(null)
                        .build());
    }
}