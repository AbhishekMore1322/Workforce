package com.workforce.mapper;

import com.workforce.dto.ComplianceRecordResponse;
import com.workforce.entity.ComplianceRecord;

public class ComplianceRecordMapper {

    public static ComplianceRecordResponse toResponse(ComplianceRecord record) {
        return new ComplianceRecordResponse(
                record.getComplianceID(),
                record.getEntityID(),
                record.getType(),
                record.getResult(),
                record.getDate(),
                record.getNotes()
        );
    }
}