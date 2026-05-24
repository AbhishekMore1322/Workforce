package com.workforce.dto;

import com.workforce.enums.Gender;
import com.workforce.enums.Status;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerResponse {

    private Long seekerID;
    private String name;
    private LocalDate dob;
    private Gender gender;
    private String address;
    private String contactInfo;
    private String skillsJSON;
    private Status status;
}