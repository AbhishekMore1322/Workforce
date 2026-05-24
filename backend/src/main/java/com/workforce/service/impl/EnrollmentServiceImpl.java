package com.workforce.service.impl;

import com.workforce.config.CurrentUserUtil;
import com.workforce.dto.EnrollmentRequest;
import com.workforce.dto.EnrollmentResponse;
import com.workforce.dto.NotificationRequest;
import com.workforce.entity.Enrollment;
import com.workforce.entity.JobSeeker;
import com.workforce.entity.TrainingProgram;
import com.workforce.enums.EnrollmentStatus;
import com.workforce.enums.NotificationCategory;
import com.workforce.enums.Role;
import com.workforce.enums.Status;
import com.workforce.exception.EnrollmentNotFoundException;
import com.workforce.exception.JobSeekerNotFoundException;
import com.workforce.exception.TrainingProgramNotFoundException;
import com.workforce.exception.UnauthorizedOperationException;
import com.workforce.mapper.EnrollmentMapper;
import com.workforce.repository.EnrollmentRepository;
import com.workforce.repository.JobSeekerRepository;
import com.workforce.repository.TrainingProgramRepository;
import com.workforce.service.EnrollmentService;
import com.workforce.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final TrainingProgramRepository programRepository;
    private final JobSeekerRepository jobSeekerRepository;
    private final NotificationService notificationService;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public EnrollmentResponse enroll(Long programId, EnrollmentRequest request) {
    	

        Role role = currentUserUtil.getCurrentUserRole();
        String username = currentUserUtil.getCurrentUser().getUsername();

        TrainingProgram program = programRepository.findById(programId)
                .orElseThrow(() ->
                        new TrainingProgramNotFoundException("Program not found"));

        if (program.getStatus() != Status.ACTIVE) {
            throw new UnauthorizedOperationException(
                    "Cannot enroll in inactive program");
        }

        if (program.getEndDate().isBefore(LocalDate.now())) {
            throw new UnauthorizedOperationException(
                    "Program already ended");
        }

        JobSeeker seeker = jobSeekerRepository.findById(request.getSeekerID())
                .orElseThrow(() ->
                        new JobSeekerNotFoundException("Job seeker not found"));

        Enrollment existing =
                enrollmentRepository.findBySeekerSeekerIDAndProgramProgramID(
                        seeker.getSeekerID(),
                        program.getProgramID());

        if (existing != null) {
            throw new UnauthorizedOperationException(
                    "Already enrolled in this program");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setProgram(program);
        enrollment.setSeeker(seeker);
        enrollment.setStatus(EnrollmentStatus.ENROLLED);
        enrollment.setCompletionDate(null);

        Enrollment saved = enrollmentRepository.save(enrollment);

        notificationService.send(
                new NotificationRequest(
                        seeker.getUser().getUsername(), // UPDATED
                        "You have been enrolled in the training program successfully.",
                        NotificationCategory.JOB,
                        saved.getEnrollmentID()
                )
        );

        return EnrollmentMapper.toResponse(saved);
    }

    @Override
    public List<EnrollmentResponse> getBySeeker(Long seekerId) {

        JobSeeker seeker = jobSeekerRepository.findById(seekerId)
                .orElseThrow(() ->
                        new JobSeekerNotFoundException("Job seeker not found"));

        Role role = currentUserUtil.getCurrentUserRole();
        String username = currentUserUtil.getCurrentUser().getUsername();

        // UPDATED: Changed from seeker.getUserUsername() to seeker.getUser().getUsername()
        if (role == Role.JOB_SEEKER &&
            !seeker.getUser().getUsername().equals(username)) {
            throw new UnauthorizedOperationException("Access denied");
        }

        List<EnrollmentResponse> responses = new ArrayList<>();
        for (Enrollment enrollment :
                enrollmentRepository.findBySeekerSeekerID(seekerId)) {
            responses.add(EnrollmentMapper.toResponse(enrollment));
        }

        return responses;
    }

    @Override
    public List<EnrollmentResponse> getByProgram(Long programId) {

        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.ADMIN && role != Role.OFFICER && role!=Role.PROGRAM_MANAGER) {
            throw new UnauthorizedOperationException(
                    "Not authorized to view program enrollments");
        }

        programRepository.findById(programId)
                .orElseThrow(() ->
                        new TrainingProgramNotFoundException("Program not found"));

        List<EnrollmentResponse> responses = new ArrayList<>();
        for (Enrollment enrollment :
                enrollmentRepository.findByProgramProgramID(programId)) {
            responses.add(EnrollmentMapper.toResponse(enrollment));
        }

        return responses;
    }

    @Override
    public EnrollmentResponse updateStatus(Long enrollmentId, String status) {

        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.ADMIN&& role!=Role.JOB_SEEKER&& role!=Role.PROGRAM_MANAGER) {
            throw new UnauthorizedOperationException(
                    "Not authorized to update enrollment");
        }

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() ->
                        new EnrollmentNotFoundException("Enrollment not found"));

        EnrollmentStatus newStatus;
        try {
            newStatus = EnrollmentStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new UnauthorizedOperationException("Invalid enrollment status");
        }

        enrollment.setStatus(newStatus);

        if (newStatus == EnrollmentStatus.COMPLETED) {
            enrollment.setCompletionDate(LocalDate.now());
        }

        return EnrollmentMapper.toResponse(
                enrollmentRepository.save(enrollment));
    }
}