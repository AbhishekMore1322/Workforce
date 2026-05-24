package com.workforce.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobApplicationReportResponse {

    private long totalApplications;
    private long pending;
    private long approved;
    private long rejected;
    private double approvalRate;
    private LocalDate generatedDate;
}
