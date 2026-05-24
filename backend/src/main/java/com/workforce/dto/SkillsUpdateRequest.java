package com.workforce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkillsUpdateRequest {

    @NotBlank(message = "Skills must not be empty")
    @Size(min = 2, max = 500, message = "Skills must be between 2 and 500 characters")
    private String skillsJSON;
}
