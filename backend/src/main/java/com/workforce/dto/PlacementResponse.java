package com.workforce.dto;

import com.workforce.enums.PlacementStatus;
import com.workforce.enums.Status;
import java.time.LocalDate;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlacementResponse {

    private Long placementID;
    private Long applicationID;
    private Long employerID;
    private String position;
    private LocalDate startDate;
    private PlacementStatus status;
}