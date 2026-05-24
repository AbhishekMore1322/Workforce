package com.workforce.mapper;

import com.workforce.dto.EnrollmentResponse;
import com.workforce.entity.Enrollment;

public class EnrollmentMapper {

    public static EnrollmentResponse toResponse(Enrollment enrollment) {
        return new EnrollmentResponse(
                enrollment.getEnrollmentID(),
                enrollment.getProgram().getProgramID(),
                enrollment.getSeeker().getSeekerID(),
                enrollment.getCompletionDate(),
                enrollment.getStatus()
        );
    }
}