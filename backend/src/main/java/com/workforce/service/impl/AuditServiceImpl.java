package com.workforce.service.impl;

import com.workforce.config.CurrentUserUtil;
import com.workforce.dto.AuditRequest;
import com.workforce.dto.AuditResponse;
import com.workforce.entity.Audit;
import com.workforce.entity.AuthUser;
import com.workforce.enums.AuditStatus;
import com.workforce.enums.Role;
import com.workforce.exception.AuditNotFoundException;
import com.workforce.exception.UnauthorizedOperationException;
import com.workforce.mapper.AuditMapper;
import com.workforce.repository.AuditRepository;
import com.workforce.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditRepository auditRepository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public AuditResponse createAudit(AuditRequest request) {

        AuthUser user = currentUserUtil.getCurrentUser();
        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.AUDITOR) {
            throw new UnauthorizedOperationException("Only AUDITOR can create audits");
        }

        Audit audit = new Audit();
        audit.setOfficer(user);
        audit.setScope(request.getScope());
        audit.setFindings(request.getFindings());
        audit.setDate(LocalDate.now());
        audit.setStatus(AuditStatus.COMPLETED);

        return AuditMapper.toResponse(auditRepository.save(audit));
    }

    @Override
    public List<AuditResponse> getAllAudits() {

        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.OFFICER &&
            role != Role.ADMIN &&
            role != Role.AUDITOR) {
            throw new UnauthorizedOperationException("Access denied");
        }

        List<AuditResponse> responses = new ArrayList<>();
        for (Audit audit : auditRepository.findAll()) {
            responses.add(AuditMapper.toResponse(audit));
        }
        return responses;
    }

    @Override
    public AuditResponse getAuditById(Long id) {

        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.OFFICER &&
            role != Role.ADMIN &&
            role != Role.AUDITOR) {
            throw new UnauthorizedOperationException("Access denied");
        }

        Audit audit = auditRepository.findById(id)
                .orElseThrow(() ->
                        new AuditNotFoundException("Audit not found"));

        return AuditMapper.toResponse(audit);
    }
}
