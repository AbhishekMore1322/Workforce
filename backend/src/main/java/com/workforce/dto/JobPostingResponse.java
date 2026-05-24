package com.workforce.dto;

import com.workforce.enums.JobStatus;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobPostingResponse {

    private Long jobID;
    private Long employerID;
    private String title;
    private String description;
    private String location;
    private LocalDate postedDate;
    private JobStatus status;
}