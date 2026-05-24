package com.workforce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationNoteRequest {

    @NotBlank(message = "Notes must not be empty")
    @Size(min = 5, max = 500, message = "Notes must be between 5 and 500 characters")
    private String notes;
}