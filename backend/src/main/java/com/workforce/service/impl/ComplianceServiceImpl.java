package com.workforce.service.impl;

import com.workforce.config.CurrentUserUtil;
import com.workforce.dto.ComplianceCheckRequest;
import com.workforce.dto.ComplianceRecordResponse;
import com.workforce.entity.ComplianceRecord;
import com.workforce.enums.ComplianceResult;
import com.workforce.enums.Role;
import com.workforce.exception.UnauthorizedOperationException;
import com.workforce.mapper.ComplianceRecordMapper;
import com.workforce.repository.ComplianceRecordRepository;
import com.workforce.service.ComplianceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplianceServiceImpl implements ComplianceService {

    private final ComplianceRecordRepository repository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public ComplianceRecordResponse checkCompliance(
            ComplianceCheckRequest request) {

        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.COMPLIANCE &&
            role != Role.OFFICER &&
            role != Role.ADMIN) {
            throw new UnauthorizedOperationException(
                    "Not authorized to perform compliance checks");
        }

        ComplianceRecord record = new ComplianceRecord();
        record.setEntityID(request.getEntityID());
        record.setType(request.getType());
        record.setResult(ComplianceResult.COMPLIANT);
        record.setNotes(request.getNotes());
        record.setDate(LocalDate.now());

        return ComplianceRecordMapper.toResponse(repository.save(record));
    }

    @Override
    public List<ComplianceRecordResponse> getComplianceReports() {

        Role role = currentUserUtil.getCurrentUserRole();

        if (role != Role.COMPLIANCE &&
            role != Role.OFFICER &&
            role != Role.ADMIN &&
            role != Role.AUDITOR) {
            throw new UnauthorizedOperationException(
                    "Access denied");
        }

        List<ComplianceRecordResponse> responses = new ArrayList<>();
        for (ComplianceRecord record : repository.findAll()) {
            responses.add(ComplianceRecordMapper.toResponse(record));
        }
        return responses;
    }
}