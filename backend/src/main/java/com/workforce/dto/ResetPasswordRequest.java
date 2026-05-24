package com.workforce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {

    @NotBlank
    private String username;     // ✅ identify the user

    @NotBlank
    private String token;        // ✅ OTP

    @NotBlank
    private String newPassword;
}