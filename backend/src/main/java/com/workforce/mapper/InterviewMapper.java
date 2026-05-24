package com.workforce.mapper;

import com.workforce.dto.InterviewResponse;
import com.workforce.entity.Interview;

public class InterviewMapper {

	public static InterviewResponse toResponse(Interview interview) {
	    return new InterviewResponse(
	            interview.getInterviewID(),
	            interview.getApplication().getApplicationID(),
	            interview.getEmployer().getEmployerID(),
	            interview.getDate(),
	            interview.getTime(),
	            interview.getStatus(),
	            interview.getResult(),
	            interview.getApplication().getJob().getTitle()
	    );
	}
}