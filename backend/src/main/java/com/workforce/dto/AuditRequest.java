package com.workforce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditRequest {

	

    @NotBlank(message = "Audit scope is required")
    private String scope;

    @NotBlank(message = "Findings must not be empty")
    private String findings;
}
