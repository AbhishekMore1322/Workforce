package com.workforce.service.impl;

import com.workforce.config.CurrentUserUtil;
import com.workforce.dto.ApplicationResponse;
import com.workforce.dto.JobSeekerRequest;
import com.workforce.dto.JobSeekerResponse;
import com.workforce.entity.AuthUser;
import com.workforce.entity.JobSeeker;
import com.workforce.enums.Role;
import com.workforce.enums.Status;
import com.workforce.exception.JobSeekerNotFoundException;
import com.workforce.exception.UnauthorizedOperationException;
import com.workforce.mapper.ApplicationMapper;
import com.workforce.mapper.JobSeekerMapper;
import com.workforce.repository.ApplicationRepository;
import com.workforce.repository.JobSeekerRepository;
import com.workforce.service.JobSeekerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobSeekerServiceImpl implements JobSeekerService {

    private final JobSeekerRepository jobSeekerRepository;
    private final ApplicationRepository applicationRepository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public JobSeekerResponse register(JobSeekerRequest request) {

        AuthUser user = currentUserUtil.getCurrentUser();
        if (user == null) {
            throw new UnauthorizedOperationException("User not authenticated");
        }

        Role role = currentUserUtil.getCurrentUserRole();
        if (role != Role.JOB_SEEKER) {
            throw new UnauthorizedOperationException("Only JOB_SEEKER can register profile");
        }

        // Updated: Using AuthUser object for existence check
        if (jobSeekerRepository.existsByUser(user)) {
            throw new UnauthorizedOperationException("Job seeker profile already exists");
        }

        JobSeeker seeker = JobSeekerMapper.toEntity(request);
        // Updated: Setting the AuthUser object directly
        seeker.setUser(user);
        seeker.setStatus(Status.ACTIVE);

        return JobSeekerMapper.toResponse(jobSeekerRepository.save(seeker));
    }

    @Override
    public List<JobSeekerResponse> getAll() {
        Role role = currentUserUtil.getCurrentUserRole();
        if (role != Role.ADMIN && role != Role.OFFICER) {
            throw new UnauthorizedOperationException("Access Denied");
        }

        List<JobSeekerResponse> responses = new ArrayList<>();
        for (JobSeeker seeker : jobSeekerRepository.findAll()) {
            responses.add(JobSeekerMapper.toResponse(seeker));
        }
        return responses;
    }

    @Override
    public JobSeekerResponse getById(Long id) {

        JobSeeker seeker = jobSeekerRepository.findById(id)
                .orElseThrow(() -> new JobSeekerNotFoundException("Job seeker not found"));

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = currentUserUtil.getCurrentUserRole();

        // Updated: Accessing username via the associated User object
        if (role == Role.JOB_SEEKER &&
                !seeker.getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Access denied");
        }

        return JobSeekerMapper.toResponse(seeker);
    }

    @Override
    public JobSeekerResponse update(Long id, JobSeekerRequest request) {

        JobSeeker seeker = jobSeekerRepository.findById(id)
                .orElseThrow(() -> new JobSeekerNotFoundException("Job seeker not found"));

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = currentUserUtil.getCurrentUserRole();

        // Updated: Accessing username via the associated User object
        if (role != Role.JOB_SEEKER ||
                !seeker.getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Only owner can update profile");
        }

        if (seeker.getStatus() == Status.INACTIVE) {
            throw new UnauthorizedOperationException("Inactive job seeker cannot update");
        }

        seeker.setName(request.getName());
        seeker.setDob(request.getDob());
        seeker.setGender(request.getGender());
        seeker.setAddress(request.getAddress());
        seeker.setContactInfo(request.getContactInfo());
        seeker.setSkillsJSON(request.getSkillsJSON());

        return JobSeekerMapper.toResponse(jobSeekerRepository.save(seeker));
    }

    @Override
    public JobSeekerResponse updateSkills(Long id, String skillsJSON) {

        JobSeeker seeker = jobSeekerRepository.findById(id)
                .orElseThrow(() -> new JobSeekerNotFoundException("Job seeker not found"));

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.JOB_SEEKER ||
                !seeker.getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Only owner can update skills");
        }

        if (seeker.getStatus() == Status.INACTIVE) {
            throw new UnauthorizedOperationException("Inactive job seeker cannot update");
        }

        seeker.setSkillsJSON(skillsJSON);
        return JobSeekerMapper.toResponse(jobSeekerRepository.save(seeker));
    }

    @Override
    public JobSeekerResponse updateStatus(Long id, String status) {

        Role role = currentUserUtil.getCurrentUserRole();
        if (role != Role.ADMIN && role != Role.OFFICER) {
            throw new UnauthorizedOperationException("Not authorized to update status");
        }

        JobSeeker seeker = jobSeekerRepository.findById(id)
                .orElseThrow(() -> new JobSeekerNotFoundException("Job seeker not found"));

        try {
            seeker.setStatus(Status.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException ex) {
            throw new UnauthorizedOperationException("Invalid status value");
        }

        return JobSeekerMapper.toResponse(jobSeekerRepository.save(seeker));
    }

    @Override
    public void delete(Long id) {

       
        JobSeeker seeker = jobSeekerRepository.findById(id)
                .orElseThrow(() -> new JobSeekerNotFoundException("Job seeker not found"));

        seeker.setStatus(Status.INACTIVE);
        jobSeekerRepository.save(seeker);
    }

    @Override
    public List<ApplicationResponse> getApplications(Long seekerId) {

        JobSeeker seeker = jobSeekerRepository.findById(seekerId)
                .orElseThrow(() -> new JobSeekerNotFoundException("Job seeker not found"));

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = currentUserUtil.getCurrentUserRole();

        // Updated: Accessing username via the associated User object
        if (role == Role.JOB_SEEKER &&
                !seeker.getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Access denied");
        }

        List<ApplicationResponse> responses = new ArrayList<>();
        applicationRepository.findBySeekerSeekerID(seekerId)
                .forEach(app -> responses.add(ApplicationMapper.toResponse(app)));

        return responses;
    }
}