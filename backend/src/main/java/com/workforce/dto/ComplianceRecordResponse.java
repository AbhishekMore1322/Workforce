package com.workforce.dto;

import com.workforce.enums.ComplianceResult;
import com.workforce.enums.EntityType;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceRecordResponse {

    private Long complianceID;
    private Long entityID;
    private EntityType type;
    private ComplianceResult result;
    private LocalDate date;
    private String notes;
}