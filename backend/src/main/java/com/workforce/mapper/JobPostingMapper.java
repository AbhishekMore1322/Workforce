package com.workforce.mapper;

import com.workforce.entity.JobPosting;
import com.workforce.dto.JobPostingResponse;

public class JobPostingMapper {

    public static JobPostingResponse toResponse(JobPosting job) {
        return new JobPostingResponse(
                job.getJobID(),
                job.getEmployer().getEmployerID(),
                job.getTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getPostedDate(),
                job.getStatus()
        );
    }
}
