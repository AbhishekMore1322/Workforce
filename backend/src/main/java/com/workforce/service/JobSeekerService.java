package com.workforce.service;

import com.workforce.dto.ApplicationResponse;
import com.workforce.dto.JobSeekerRequest;
import com.workforce.dto.JobSeekerResponse;

import java.util.List;

public interface JobSeekerService {

    JobSeekerResponse register(JobSeekerRequest request);

    List<JobSeekerResponse> getAll();

    JobSeekerResponse getById(Long id);

    JobSeekerResponse update(Long id, JobSeekerRequest request);

    JobSeekerResponse updateStatus(Long id, String status);

    JobSeekerResponse updateSkills(Long id, String skillsJSON);

    void delete(Long id);

    List<ApplicationResponse> getApplications(Long seekerId);
}