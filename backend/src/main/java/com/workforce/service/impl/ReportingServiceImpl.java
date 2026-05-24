package com.workforce.service.impl;

import com.workforce.config.CurrentUserUtil;
import com.workforce.dto.ComplianceReportResponse;
import com.workforce.dto.EmployerReportResponse;
import com.workforce.dto.JobApplicationReportResponse;
import com.workforce.dto.PlacementReportResponse;
import com.workforce.dto.TrainingReportResponse;
import com.workforce.enums.*;
import com.workforce.exception.UnauthorizedOperationException;
import com.workforce.repository.*;
import com.workforce.service.ReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ReportingServiceImpl implements ReportingService {

    private final ApplicationRepository applicationRepository;
    private final PlacementRepository placementRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final TrainingProgramRepository trainingProgramRepository;
    private final EmployerRepository employerRepository;
    private final ComplianceRecordRepository complianceRecordRepository;
    private final CurrentUserUtil currentUserUtil;

    @Override
    public JobApplicationReportResponse jobApplicationReport() {

        Role role = currentUserUtil.getCurrentUserRole();
        if (role != Role.ADMIN && role != Role.AUDITOR) {
            throw new UnauthorizedOperationException("Access denied");
        }

        long total = applicationRepository.count();
        long submitted = applicationRepository.countByStatus(ApplicationStatus.SUBMITTED);
        long approved = applicationRepository.countByStatus(ApplicationStatus.APPROVED);
        long rejected = applicationRepository.countByStatus(ApplicationStatus.REJECTED);

        double approvalRate = total == 0 ? 0 : (approved * 100.0) / total;

        return new JobApplicationReportResponse(
                total,
                submitted,
                approved,
                rejected,
                approvalRate,
                LocalDate.now()
        );
    }

    @Override
    public PlacementReportResponse placementReport() {

        Role role = currentUserUtil.getCurrentUserRole();
        if (role != Role.ADMIN && role != Role.AUDITOR) {
            throw new UnauthorizedOperationException("Access denied");
        }

        long total = placementRepository.count();
        long successful = placementRepository.countByStatus(PlacementStatus.CONFIRMED);
        long cancelled = placementRepository.countByStatus(PlacementStatus.CANCELLED);

        double successRate = total == 0 ? 0 : (successful * 100.0) / total;

        return new PlacementReportResponse(
                total,
                successful,
                cancelled,
                successRate,
                LocalDate.now()
        );
    }

    @Override
    public TrainingReportResponse trainingReport() {

        Role role = currentUserUtil.getCurrentUserRole();
        if (role != Role.ADMIN && role != Role.PROGRAM_MANAGER && role!=Role.AUDITOR) {
            throw new UnauthorizedOperationException("Access denied");
        }

        long programs = trainingProgramRepository.count();
        long enrollments = enrollmentRepository.count();
        long completed = enrollmentRepository.countByStatus(EnrollmentStatus.COMPLETED);
        long active = enrollmentRepository.countByStatus(EnrollmentStatus.ENROLLED);

        return new TrainingReportResponse(
                programs,
                enrollments,
                completed,
                active,
                LocalDate.now()
        );
    }

    @Override
    public EmployerReportResponse employerReport() {

        Role role = currentUserUtil.getCurrentUserRole();
        if (role != Role.ADMIN && role != Role.AUDITOR) {
            throw new UnauthorizedOperationException("Access denied");
        }

        long total = employerRepository.count();
        long active = employerRepository.countByStatus(Status.APPROVED);
        long inactive = employerRepository.countByStatus(Status.INACTIVE);

        return new EmployerReportResponse(
                total,
                active,
                inactive,
                LocalDate.now()
        );
    }

    @Override
    public ComplianceReportResponse complianceReport() {

        Role role = currentUserUtil.getCurrentUserRole();
        if (role != Role.ADMIN &&
            role != Role.OFFICER &&
            role != Role.COMPLIANCE &&
            role != Role.AUDITOR) {
            throw new UnauthorizedOperationException("Access denied");
        }

        long total = complianceRecordRepository.count();
        long compliant = complianceRecordRepository.countByResult(ComplianceResult.COMPLIANT);
        long nonCompliant = complianceRecordRepository.countByResult(ComplianceResult.NON_COMPLIANT);

        return new ComplianceReportResponse(
                total,
                compliant,
                nonCompliant,
                LocalDate.now()
        );
    }
}