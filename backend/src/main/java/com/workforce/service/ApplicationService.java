package com.workforce.service;

import com.workforce.dto.*;
import java.util.List;

public interface ApplicationService {

    ApplicationResponse apply(ApplicationRequest request);
    List<ApplicationResponse> getAll();
    ApplicationResponse getById(Long id);
    List<ApplicationResponse> getBySeeker(Long seekerId);
    List<ApplicationResponse> getByJob(Long jobId);

    ApplicationResponse updateStatus(Long id, String status);
    void addNote(Long id, ApplicationNoteRequest request);
    void withdraw(Long id);
}