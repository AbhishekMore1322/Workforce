package com.workforce.dto;

import com.workforce.enums.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {

    private Long interviewID;
    private Long applicationID;
    private Long employerID;
    private LocalDate date;
    private LocalTime time;

    private InterviewStatus status;
    private InterviewResult result;
    private String jobTitle;
}