package com.workforce.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalTime;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewRequest {

    @NotNull(message = "Application ID is required")
    @Positive(message = "Application ID must be a positive number")
    private Long applicationID;

    @NotNull(message = "Employer ID is required")
    @Positive(message = "Employer ID must be a positive number")
    private Long employerID;

    @NotNull(message = "Interview date is required")
    @FutureOrPresent(message = "Interview date cannot be in the past")
    private LocalDate date;

    @NotNull(message = "Interview time is required")
    private LocalTime time;
}