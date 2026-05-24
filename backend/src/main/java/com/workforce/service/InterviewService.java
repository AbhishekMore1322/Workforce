package com.workforce.service;

import com.workforce.dto.*;
import java.util.List;

public interface InterviewService {

    InterviewResponse schedule(InterviewRequest request);
    void delete(Long id);

    List<InterviewResponse> getByCurrentEmployer();
	InterviewResponse getById(Long id);
	InterviewResponse updateStatus(Long id, InterviewStatusUpdateRequest request);
}