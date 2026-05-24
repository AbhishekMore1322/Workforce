package com.workforce.mapper;

import com.workforce.dto.ApplicationResponse;
import com.workforce.entity.Application;
import com.workforce.entity.Employer;
import com.workforce.entity.JobPosting;

public class ApplicationMapper {

    public static ApplicationResponse toResponse(Application application) {

        JobPosting job = application.getJob();
        Employer employer = job.getEmployer();

        return new ApplicationResponse(
                application.getApplicationID(),
                application.getSeeker().getSeekerID(),
                job.getJobID(),
                job.getTitle(),
                employer.getEmployerID(),
                employer.getName(),
                application.getSubmittedDate(),
                application.getStatus()
        );
    }
}