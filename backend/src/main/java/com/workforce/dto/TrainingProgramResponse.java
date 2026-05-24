package com.workforce.dto;

import com.workforce.enums.Status;
import java.time.LocalDate;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingProgramResponse {

    private Long programID;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private Status status;
}