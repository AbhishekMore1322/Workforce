package com.workforce.service;

import com.workforce.dto.*;
import com.workforce.enums.JobStatus;
import java.util.List;

public interface JobPostingService {

    JobPostingResponse create(JobPostingRequest request);

    List<JobPostingResponse> getAll();

    JobPostingResponse getById(Long id);

    JobPostingResponse update(Long id, JobPostingRequest request);

    JobPostingResponse updateStatus(Long id, JobStatus status);

    void delete(Long id);

    List<JobPostingResponse> search(String keyword);
}