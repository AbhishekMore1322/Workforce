package com.workforce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlacementReportResponse {

    private long totalPlacements;
    private long successfulPlacements;
    private long cancelledPlacements;
    private double successRate;
    private LocalDate generatedDate;
}