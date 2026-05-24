package com.workforce.service.impl;

import com.workforce.config.CurrentUserUtil;
import com.workforce.dto.*;
import com.workforce.entity.*;
import com.workforce.enums.*;
import com.workforce.exception.*;
import com.workforce.mapper.InterviewMapper;
import com.workforce.repository.*;
import com.workforce.service.InterviewService;
import com.workforce.service.NotificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final EmployerRepository employerRepository;
    private final NotificationService notificationService;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public InterviewResponse schedule(InterviewRequest request) {

        Role role = currentUserUtil.getCurrentUserRole();
        AuthUser user = currentUserUtil.getCurrentUser();

        if (role != Role.EMPLOYER && role != Role.OFFICER) {
            throw new UnauthorizedOperationException("Not authorized");
        }

        Application application = applicationRepository.findById(request.getApplicationID())
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));

        Employer employer = employerRepository.findById(request.getEmployerID())
                .orElseThrow(() -> new EmployerNotFoundException("Employer not found"));

        if (role == Role.EMPLOYER &&
            !employer.getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Not your employer profile");
        }

        if (role == Role.EMPLOYER &&
            !application.getJob().getEmployer().getEmployerID()
                    .equals(employer.getEmployerID())) {
            throw new UnauthorizedOperationException("Application not for this employer");
        }

        Interview interview = new Interview();
        interview.setApplication(application);
        interview.setEmployer(employer);
        interview.setDate(request.getDate());
        interview.setTime(request.getTime());
        interview.setStatus(InterviewStatus.SCHEDULED);

        Interview saved = interviewRepository.save(interview);

        notificationService.send(
                new NotificationRequest(
                        application.getSeeker().getUser().getUsername(),
                        "Your interview has been scheduled on " +
                                saved.getDate() + " at " + saved.getTime(),
                        NotificationCategory.INTERVIEW,
                        application.getApplicationID()
                )
        );

        return InterviewMapper.toResponse(saved);
    }

    @Override
    public InterviewResponse getById(Long id) {

        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new InterviewNotFoundException("Interview not found"));

        Role role = currentUserUtil.getCurrentUserRole();
        String username = currentUserUtil.getCurrentUser().getUsername();

        if (role == Role.ADMIN || role == Role.OFFICER) {
            return InterviewMapper.toResponse(interview);
        }

        if (role == Role.JOB_SEEKER &&
            !interview.getApplication().getSeeker()
                    .getUser().getUsername().equals(username)) {
            throw new UnauthorizedOperationException("Access denied");
        }

        if (role == Role.EMPLOYER &&
            !interview.getEmployer()
                    .getUser().getUsername().equals(username)) {
            throw new UnauthorizedOperationException("Access denied");
        }

        return InterviewMapper.toResponse(interview);
    }

    @Override
    public InterviewResponse updateStatus(Long id, InterviewStatusUpdateRequest request) {

        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new InterviewNotFoundException("Interview not found"));

        Role role = currentUserUtil.getCurrentUserRole();
        String username = currentUserUtil.getCurrentUser().getUsername();

        if (role != Role.EMPLOYER && role != Role.OFFICER) {
            throw new UnauthorizedOperationException("Not authorized");
        }

        if (role == Role.EMPLOYER &&
            !interview.getEmployer().getUser().getUsername().equals(username)) {
            throw new UnauthorizedOperationException("Not your interview");
        }

        if (interview.getStatus() == InterviewStatus.COMPLETED) {
            throw new UnauthorizedOperationException("Interview already completed");
        }

        interview.setStatus(InterviewStatus.COMPLETED);
        interview.setResult(request.getResult());

        Interview saved = interviewRepository.save(interview);

        sendResultNotification(saved);

        return InterviewMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {

        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new InterviewNotFoundException("Interview not found"));

        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.EMPLOYER && role != Role.OFFICER) {
            throw new UnauthorizedOperationException("Not authorized");
        }

        interview.setStatus(InterviewStatus.CANCELLED);
        interviewRepository.save(interview);
    }

    // ✅ ✅ NEW METHOD
    @Override
    public List<InterviewResponse> getByCurrentEmployer() {

        Role role = currentUserUtil.getCurrentUserRole();
        AuthUser user = currentUserUtil.getCurrentUser();

        if (role != Role.EMPLOYER && role != Role.OFFICER) {
            throw new UnauthorizedOperationException("Not authorized");
        }

        // ✅ USE EXISTING REPOSITORY METHOD
        Employer employer = employerRepository.findByUser_Username(user.getUsername());

        if (employer == null) {
            throw new EmployerNotFoundException("Employer not found");
        }

        return interviewRepository
                .findByEmployerEmployerID(employer.getEmployerID())
                .stream()
                .map(InterviewMapper::toResponse)
                .toList();
    }

    private void sendResultNotification(Interview interview) {

        String message = interview.getResult() == InterviewResult.SHORTLISTED
                ? "Congratulations! You have been shortlisted after the interview."
                : "Thank you for attending the interview. Unfortunately, you were not shortlisted.";

        notificationService.send(
                new NotificationRequest(
                        interview.getApplication().getSeeker().getUser().getUsername(),
                        message,
                        NotificationCategory.INTERVIEW,
                        interview.getApplication().getApplicationID()
                )
        );
    }
}