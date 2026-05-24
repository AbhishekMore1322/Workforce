package com.workforce.dto;

import com.workforce.enums.ComplianceResult;
import com.workforce.enums.EntityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceCheckRequest {

    @NotNull(message = "Entity ID is required")
    private Long entityID;

    @NotNull(message = "Entity type is required")
    private EntityType type;

    @NotNull(message = "Compliance result is required")
    private ComplianceResult result;


    @NotBlank(message = "Compliance notes must not be blank")
    private String notes;
    
}