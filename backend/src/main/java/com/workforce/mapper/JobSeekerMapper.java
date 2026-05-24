package com.workforce.mapper;

import com.workforce.dto.JobSeekerRequest;
import com.workforce.dto.JobSeekerResponse;
import com.workforce.entity.JobSeeker;

public class JobSeekerMapper {

    public static JobSeeker toEntity(JobSeekerRequest request) {
        JobSeeker seeker = new JobSeeker();
        seeker.setName(request.getName());
        seeker.setDob(request.getDob());
        seeker.setGender(request.getGender());
        seeker.setAddress(request.getAddress());
        seeker.setContactInfo(request.getContactInfo());
        seeker.setSkillsJSON(request.getSkillsJSON());
        return seeker;
    }

    public static JobSeekerResponse toResponse(JobSeeker seeker) {
        return new JobSeekerResponse(
                seeker.getSeekerID(),
                seeker.getName(),
                seeker.getDob(),
                seeker.getGender(),
                seeker.getAddress(),
                seeker.getContactInfo(),
                seeker.getSkillsJSON(),
                seeker.getStatus()
        );
    }
}