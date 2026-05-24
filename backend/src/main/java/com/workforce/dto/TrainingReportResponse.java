package com.workforce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrainingReportResponse {

    private long totalPrograms;
    private long totalEnrollments;
    private long completedEnrollments;
    private long activeEnrollments; 
    private LocalDate generatedDate;
}