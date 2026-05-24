package com.workforce.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobPostingRequest {

    @NotNull(message = "Employer ID is required")
    @Positive(message = "Employer ID must be positive")
    private Long employerID;

    @NotBlank(message = "Job title is required")
    @Size(min = 3, max = 150, message = "Title must be 3–150 characters")
    private String title;

    @Size(max = 1000, message = "Description too long")
    private String description;

    private String requirementsJSON;

    @NotBlank(message = "Location is required")
    private String location;
}
