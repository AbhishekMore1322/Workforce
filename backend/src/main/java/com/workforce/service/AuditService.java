package com.workforce.service;

import com.workforce.dto.*;

import java.util.List;

public interface AuditService {

    AuditResponse createAudit(AuditRequest request);
    List<AuditResponse> getAllAudits();
    AuditResponse getAuditById(Long id);
}
