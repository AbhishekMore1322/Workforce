package com.workforce.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerRequest {

    @NotBlank(message = "Employer name must not be blank")
    @Size(min = 2, max = 100, message = "Employer name must be between 2 and 100 characters")
    private String name;

    @Size(max = 100, message = "Industry must not exceed 100 characters")
    private String industry;

    @NotBlank(message = "Contact info is required")
    @Email(message = "Contact info must be a valid email")
    private String contactInfo;
}
