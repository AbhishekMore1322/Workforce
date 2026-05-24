package com.workforce.service.impl;

import com.workforce.config.CurrentUserUtil;
import com.workforce.dto.SeekerDocumentRequest;
import com.workforce.dto.SeekerDocumentResponse;
import com.workforce.entity.AuthUser;
import com.workforce.entity.JobSeeker;
import com.workforce.entity.SeekerDocument;
import com.workforce.enums.DocumentType;
import com.workforce.enums.Role;
import com.workforce.enums.Status;
import com.workforce.exception.JobSeekerNotFoundException;
import com.workforce.exception.SeekerDocumentNotFoundException;
import com.workforce.exception.UnauthorizedOperationException;
import com.workforce.mapper.SeekerDocumentMapper;
import com.workforce.repository.JobSeekerRepository;
import com.workforce.repository.SeekerDocumentRepository;
import com.workforce.service.SeekerDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeekerDocumentServiceImpl implements SeekerDocumentService {

    private final JobSeekerRepository jobSeekerRepository;
    private final SeekerDocumentRepository documentRepository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public SeekerDocumentResponse upload(Long seekerId, SeekerDocumentRequest request) {

        JobSeeker seeker = jobSeekerRepository.findById(seekerId)
                .orElseThrow(() -> new JobSeekerNotFoundException("Job seeker not found"));

        if (seeker.getStatus() == Status.INACTIVE) {
            throw new UnauthorizedOperationException("Inactive job seeker cannot upload documents");
        }

        SeekerDocument document = SeekerDocumentMapper.toEntity(request);
        document.setSeeker(seeker);
        document.setUploadedDate(LocalDate.now());

        return SeekerDocumentMapper.toResponse(documentRepository.save(document));
    }

    @Override
    public List<SeekerDocumentResponse> getBySeeker(Long seekerId) {

        jobSeekerRepository.findById(seekerId)
                .orElseThrow(() -> new JobSeekerNotFoundException("Job seeker not found"));

        List<SeekerDocumentResponse> responses = new ArrayList<>();
        for (SeekerDocument document : documentRepository.findBySeekerSeekerID(seekerId)) {
            responses.add(SeekerDocumentMapper.toResponse(document));
        }
        return responses;
    }

    @Override
    public void delete(Long seekerId, Long documentId) {

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = user.getAuthorities().iterator().next().getAuthority();

        JobSeeker seeker = jobSeekerRepository.findById(seekerId)
                .orElseThrow(() -> new JobSeekerNotFoundException("Job seeker not found"));

        if (role == Role.JOB_SEEKER && !seeker.getUser().getUsername().equals(user.getUsername())) {
            throw new UnauthorizedOperationException("Access denied");
        }

        SeekerDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new SeekerDocumentNotFoundException("Document not found"));

        if (!document.getSeeker().getSeekerID().equals(seekerId)) {
            throw new UnauthorizedOperationException("Document does not belong to this seeker");
        }

        documentRepository.delete(document);
    }
    @Override
    public String getLatestResume(Long seekerId) {

        SeekerDocument doc = documentRepository
                .findTopBySeekerSeekerIDAndDocTypeOrderByUploadedDateDesc(
                        seekerId,
                        DocumentType.RESUME   
                )
                .orElseThrow(() ->
                        new SeekerDocumentNotFoundException("No resume found")
                );

        return doc.getFileURI();
    }
}
