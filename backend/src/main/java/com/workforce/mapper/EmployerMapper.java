package com.workforce.mapper;

import com.workforce.dto.EmployerRequest;
import com.workforce.dto.EmployerResponse;
import com.workforce.entity.Employer;

public class EmployerMapper {

    public static Employer toEntity(EmployerRequest request) {
        Employer employer = new Employer();
        employer.setName(request.getName());
        employer.setIndustry(request.getIndustry());
        employer.setContactInfo(request.getContactInfo());
        return employer;
    }

    public static EmployerResponse toResponse(Employer employer) {
        return new EmployerResponse(
                employer.getEmployerID(),
                employer.getName(),
                employer.getIndustry(),
                employer.getContactInfo(),
                employer.getStatus()
        );
    }
}