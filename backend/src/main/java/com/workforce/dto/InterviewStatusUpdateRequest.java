package com.workforce.dto;

import com.workforce.enums.InterviewResult;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewStatusUpdateRequest {

    @NotNull
    private InterviewResult result;
}