package com.workforce.controller;

import com.workforce.dto.ForgotPasswordRequest;
import com.workforce.dto.ResetPasswordRequest;
import com.workforce.dto.SignupRequest;
import com.workforce.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(
            @Valid @RequestBody SignupRequest request) {

        authService.signup(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User registered successfully");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request);
        return ResponseEntity.ok(
                "If the email exists, reset instructions have been sent"
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);
        return ResponseEntity.ok("Password updated successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {

        authService.logout();
        return ResponseEntity.ok("Logged out successfully");
    }
}
