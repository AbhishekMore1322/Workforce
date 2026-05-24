package com.workforce.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRequest {

    @NotNull(message = "Seeker ID is required for enrollment")
    @Positive(message = "Seeker ID must be a positive number")
    private Long seekerID;
}