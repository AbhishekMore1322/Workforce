package com.workforce.dto;

import com.workforce.enums.ApplicationStatus;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {

    private Long applicationID;
    private Long seekerID;
    private Long jobID;
    private String jobTitle;
    private Long employerID;
    private String employerName;
    private LocalDate submittedDate;
    private ApplicationStatus status;
}