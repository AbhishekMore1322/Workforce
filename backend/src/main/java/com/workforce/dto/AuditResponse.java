package com.workforce.dto;

import com.workforce.enums.AuditStatus;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditResponse {

    private Long auditID;
    private String officerUsername;
    private String scope;
    private String findings;
    private LocalDate date;
    private AuditStatus status;
}