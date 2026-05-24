package com.workforce.dto;

import com.workforce.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerRequest {

    @NotBlank(message = "Name must not be blank")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dob;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotBlank(message = "Address must not be blank")
    @Size(min = 5, max = 250, message = "Address must be between 5 and 250 characters")
    private String address;

    @NotBlank(message = "Contact information is required")
    @Email(message = "Contact information must be a valid email")
    private String contactInfo;

    @NotBlank(message = "Skills must not be empty")
    @Size(min = 2, max = 500, message = "Skills must be between 2 and 500 characters")
    private String skillsJSON;
}
