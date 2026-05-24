package com.workforce.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {

    private String scope;
    private String metrics;
    private LocalDate generatedDate;
}
