package com.workforce.mapper;
import com.workforce.dto.AuditResponse;
import com.workforce.entity.Audit;

public class AuditMapper {

    public static AuditResponse toResponse(Audit audit) {
        return new AuditResponse(
                audit.getAuditID(),
                audit.getOfficer().getUsername(),
                audit.getScope(),
                audit.getFindings(),
                audit.getDate(),
                audit.getStatus()
        );
    }
}