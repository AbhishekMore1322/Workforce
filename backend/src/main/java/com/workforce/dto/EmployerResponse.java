package com.workforce.dto;

import com.workforce.enums.Status;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployerResponse {

    private Long employerID;
    private String name;
    private String industry;
    private String contactInfo;
    private Status status;
}