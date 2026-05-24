package com.workforce.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationRequest {

    @NotNull(message = "Seeker ID is required")
    @Positive(message = "Seeker ID must be a positive number")
    private Long seekerID;

    @NotNull(message = "Job ID is required")
    @Positive(message = "Job ID must be a positive number")
    private Long jobID;
}