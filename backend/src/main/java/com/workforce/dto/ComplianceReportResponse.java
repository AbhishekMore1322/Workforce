package com.workforce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComplianceReportResponse {

    private long totalChecks;
    private long compliantCount;
    private long nonCompliantCount;
    private LocalDate generatedDate;
}
