package com.workforce.service;

import com.workforce.dto.SeekerDocumentRequest;
import com.workforce.dto.SeekerDocumentResponse;

import java.util.List;

public interface SeekerDocumentService {

    SeekerDocumentResponse upload(Long seekerId, SeekerDocumentRequest request);

    List<SeekerDocumentResponse> getBySeeker(Long seekerId);

    void delete(Long seekerId, Long documentId);
    String getLatestResume(Long seekerId);
}
