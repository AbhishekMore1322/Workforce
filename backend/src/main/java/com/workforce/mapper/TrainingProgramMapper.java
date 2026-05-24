package com.workforce.mapper;

import com.workforce.dto.TrainingProgramResponse;
import com.workforce.entity.TrainingProgram;

public class TrainingProgramMapper {

    public static TrainingProgramResponse toResponse(TrainingProgram program) {
        return new TrainingProgramResponse(
                program.getProgramID(),
                program.getTitle(),
                program.getDescription(),
                program.getStartDate(),
                program.getEndDate(),
                program.getStatus()
        );
    }
}