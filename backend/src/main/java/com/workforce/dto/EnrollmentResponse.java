package com.workforce.dto;

import com.workforce.enums.EnrollmentStatus;
import java.time.LocalDate;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponse {

    private Long enrollmentID;
    private Long programID;
    private Long seekerID;
    private LocalDate completionDate;
    private EnrollmentStatus status;
}