package com.workforce.service.impl;

import com.workforce.config.CurrentUserUtil;
import com.workforce.dto.ApplicationNoteRequest;
import com.workforce.dto.ApplicationRequest;
import com.workforce.dto.ApplicationResponse;
import com.workforce.dto.NotificationRequest;
import com.workforce.entity.*;
import com.workforce.enums.ApplicationStatus;
import com.workforce.enums.NotificationCategory;
import com.workforce.enums.Role;
import com.workforce.enums.Status;
import com.workforce.exception.*;
import com.workforce.mapper.ApplicationMapper;
import com.workforce.repository.*;
import com.workforce.service.ApplicationService;
import com.workforce.service.NotificationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationUpdateRepository updateRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final JobPostingRepository jobPostingRepository;
    private final NotificationService notificationService;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public ApplicationResponse apply(ApplicationRequest request) {
        AuthUser user = currentUserUtil.getCurrentUser();

        JobSeeker seeker = jobSeekerRepository.findById(request.getSeekerID())
                .orElseThrow(() -> new JobSeekerNotFoundException("Job seeker not found"));
        if (seeker.getStatus() == Status.INACTIVE) {
            throw new UnauthorizedOperationException("Inactive job seeker cannot Apply for job");
        }

        // Changed from getUserUsername() to getUser().getUsername()
        if (!seeker.getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Cannot apply for another user");
        }

        JobPosting job = jobPostingRepository.findById(request.getJobID())
                .orElseThrow(() -> new JobPostingNotFoundException("Job not found"));

        if (applicationRepository
                .findBySeekerSeekerIDAndJobJobID(seeker.getSeekerID(), job.getJobID())
                .isPresent()) {
            throw new UnauthorizedOperationException("Already applied to this job");
        }

        Application application = new Application();
        application.setSeeker(seeker);
        application.setJob(job);
        application.setSubmittedDate(LocalDate.now());
        application.setStatus(ApplicationStatus.SUBMITTED);

        Application saved = applicationRepository.save(application);

        notificationService.send(
                new NotificationRequest(
                        seeker.getUser().getUsername(), // Changed here
                        "Your job application has been submitted successfully.",
                        NotificationCategory.APPLICATION,
                        saved.getApplicationID()
                )
        );

        return ApplicationMapper.toResponse(saved);
    }

    @Override
    public ApplicationResponse updateStatus(Long id, String status) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = currentUserUtil.getCurrentUserRole();

        // Changed from getUserUsername() to getUser().getUsername()
        if (role == Role.EMPLOYER &&
            !application.getJob().getEmployer().getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Not your application");
        }

        try {
            application.setStatus(ApplicationStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException ex) {
            throw new UnauthorizedOperationException("Invalid application status");
        }

        Application saved = applicationRepository.save(application);

        notificationService.send(
                new NotificationRequest(
                        saved.getSeeker().getUser().getUsername(), // Changed here
                        "Your application status is now: " + saved.getStatus(),
                        NotificationCategory.APPLICATION,
                        saved.getApplicationID()
                )
        );

        return ApplicationMapper.toResponse(saved);
    }

    @Override
    public void addNote(Long id, ApplicationNoteRequest request) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));

        ApplicationUpdate update = new ApplicationUpdate();
        update.setApplication(application);
        update.setNotes(request.getNotes());
        update.setDate(LocalDate.now());
        update.setStatus(application.getStatus());

        updateRepository.save(update);
    }

    @Override
    public void withdraw(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));

        AuthUser user = currentUserUtil.getCurrentUser();

        // Changed from getUserUsername() to getUser().getUsername()
        if (!application.getSeeker().getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Cannot withdraw this application");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        applicationRepository.save(application);
    }

    @Override
    public List<ApplicationResponse> getAll() {
        return applicationRepository.findAll()
                .stream()
                .map(ApplicationMapper::toResponse)
                .toList();
    }

    @Override
    public ApplicationResponse getById(Long id) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = currentUserUtil.getCurrentUserRole();

        // Changed from getUserUsername() to getUser().getUsername()
        if (role == Role.JOB_SEEKER &&
            !application.getSeeker().getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Access denied");
        }

        return ApplicationMapper.toResponse(application);
    }

    @Override
    public List<ApplicationResponse> getBySeeker(Long seekerId) {
        JobSeeker seeker = jobSeekerRepository.findById(seekerId)
                .orElseThrow(() -> new JobSeekerNotFoundException("Job seeker not found"));

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = currentUserUtil.getCurrentUserRole();

        // Changed from getUserUsername() to getUser().getUsername()
        if (role == Role.JOB_SEEKER &&
            !seeker.getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Access denied");
        }

        return applicationRepository.findBySeekerSeekerID(seekerId)
                .stream()
                .map(ApplicationMapper::toResponse)
                .toList();
    }

    @Override
    public List<ApplicationResponse> getByJob(Long jobId) {
        JobPosting job = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new JobPostingNotFoundException("Job not found"));

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.EMPLOYER) {
            throw new UnauthorizedOperationException("Access denied");
        }

        return applicationRepository.findByJobJobID(jobId)
                .stream()
                .map(ApplicationMapper::toResponse)
                .toList();
    }
}