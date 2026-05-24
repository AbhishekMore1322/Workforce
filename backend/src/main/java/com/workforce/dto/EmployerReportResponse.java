package com.workforce.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployerReportResponse {

    private long totalEmployers;
    private long activeEmployers;
    private long inactiveEmployers;
    private LocalDate generatedDate;
}