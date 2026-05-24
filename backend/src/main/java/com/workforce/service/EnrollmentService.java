package com.workforce.service;

import com.workforce.dto.*;
import java.util.List;

public interface EnrollmentService {

    EnrollmentResponse enroll(Long programId, EnrollmentRequest request);

    List<EnrollmentResponse> getBySeeker(Long seekerId);

    List<EnrollmentResponse> getByProgram(Long programId);

    EnrollmentResponse updateStatus(Long enrollmentId, String status);
}