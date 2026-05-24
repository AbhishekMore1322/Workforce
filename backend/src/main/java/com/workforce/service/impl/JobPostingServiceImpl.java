package com.workforce.service.impl;

import com.workforce.config.CurrentUserUtil;
import com.workforce.dto.JobPostingRequest;
import com.workforce.dto.JobPostingResponse;
import com.workforce.entity.AuthUser;
import com.workforce.entity.Employer;
import com.workforce.entity.JobPosting;
import com.workforce.entity.JobSeeker;
import com.workforce.enums.JobStatus;
import com.workforce.enums.Role;
import com.workforce.enums.Status;
import com.workforce.exception.*;
import com.workforce.mapper.JobPostingMapper;
import com.workforce.notification.EmailSender;
import com.workforce.repository.EmployerRepository;
import com.workforce.repository.JobPostingRepository;
import com.workforce.repository.JobSeekerRepository;
import com.workforce.service.JobPostingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobPostingServiceImpl implements JobPostingService {

    private final JobPostingRepository jobRepository;
    private final EmployerRepository employerRepository;
    private final CurrentUserUtil currentUserUtil;
    private final JobSeekerRepository jobSeekerRepository;
    private final EmailSender emailSender;

    @Override
    public JobPostingResponse create(JobPostingRequest request) {

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = user.getAuthorities().iterator().next().getAuthority();

        if (role != Role.EMPLOYER) {
            throw new UnauthorizedOperationException("Only employer can post jobs");
        }

        Employer employer = employerRepository.findById(request.getEmployerID())
                .orElseThrow(() -> new EmployerNotFoundException("Employer not found"));

        // UPDATED: Changed .getUserUsername() to .getUser().getUsername()
        if (!employer.getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Not your employer profile");
        }

       
        JobPosting job = new JobPosting();
        job.setEmployer(employer);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirementsJSON(request.getRequirementsJSON());
        job.setLocation(request.getLocation());
        job.setPostedDate(LocalDate.now());
        job.setStatus(JobStatus.OPEN);

        JobPosting savedJob = jobRepository.save(job);
        List<JobSeeker> seekers = jobSeekerRepository.findByStatus(Status.ACTIVE);

        for (JobSeeker seeker : seekers) {
            if (seeker.getContactInfo() != null) {

                try {
                    String subject = "New Job Posted: " + savedJob.getTitle();

                    String body =
                            "A new job has been posted.\n\n" +
                                    "Title: " + savedJob.getTitle() + "\n" +
                                    "Location: " + savedJob.getLocation() + "\n" +
                                    "Description: " + savedJob.getDescription() + "\n\n" +
                                    "Login to the portal to apply.";

                    emailSender.send(seeker.getContactInfo(), subject + "\n\n" + body);

                } catch (Exception e) {
                    System.out.println(
                            "Failed to email job seeker: " + seeker.getContactInfo()
                    );
                }
            }
        }

        return JobPostingMapper.toResponse(savedJob);

    }

    @Override
    public List<JobPostingResponse> getAll() {

        List<JobPostingResponse> list = new ArrayList<>();
        for (JobPosting job : jobRepository.findAll()) {
            list.add(JobPostingMapper.toResponse(job));
        }
        return list;
    }

    @Override
    public JobPostingResponse getById(Long id) {

        JobPosting job = jobRepository.findById(id)
                .orElseThrow(() -> new JobPostingNotFoundException("Job not found"));

        return JobPostingMapper.toResponse(job);
    }

    @Override
    public JobPostingResponse update(Long id, JobPostingRequest request) {

        JobPosting job = jobRepository.findById(id)
                .orElseThrow(() -> new JobPostingNotFoundException("Job not found"));

        AuthUser user = currentUserUtil.getCurrentUser();

        // UPDATED: Changed .getUserUsername() to .getUser().getUsername()
        if (!job.getEmployer().getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Not authorized to update this job");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirementsJSON(request.getRequirementsJSON());
        job.setLocation(request.getLocation());

        return JobPostingMapper.toResponse(jobRepository.save(job));
    }

    @Override
    public JobPostingResponse updateStatus(Long id, JobStatus status) {

        JobPosting job = jobRepository.findById(id)
                .orElseThrow(() -> new JobPostingNotFoundException("Job not found"));

        AuthUser user = currentUserUtil.getCurrentUser();

        // UPDATED: Changed .getUserUsername() to .getUser().getUsername()
        if (!job.getEmployer().getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Not authorized");
        }

        job.setStatus(status);
        return JobPostingMapper.toResponse(jobRepository.save(job));
    }

    @Override
    public void delete(Long id) {

        JobPosting job = jobRepository.findById(id)
                .orElseThrow(() -> new JobPostingNotFoundException("Job not found"));

        AuthUser user = currentUserUtil.getCurrentUser();

        // UPDATED: Changed .getUserUsername() to .getUser().getUsername()
        if (!job.getEmployer().getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Not authorized");
        }

        job.setStatus(JobStatus.CLOSED);
        jobRepository.save(job);
    }

    @Override
    public List<JobPostingResponse> search(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAll();
        }
        List<JobPostingResponse> list = new ArrayList<>();
        for (JobPosting job : jobRepository.searchByKeyword(keyword.trim())) {
            list.add(JobPostingMapper.toResponse(job));
        }
        return list;
    }
}