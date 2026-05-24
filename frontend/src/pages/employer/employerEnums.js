export const ApplicationStatus = {
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
};

export const InterviewStatus = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const InterviewResult = {
  SHORTLISTED: 'SHORTLISTED',
  REJECTED: 'REJECTED',
};

export const PlacementStatus = {
  CREATED: 'CREATED',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
};

export const normalizeStatus = (v) =>
  v ? String(v).toUpperCase() : '';

export const sortApplicationsByPriority = (apps = []) => {
  const order = {
    SUBMITTED: 0,
    APPROVED: 1,
    REJECTED: 2,
    WITHDRAWN: 3,
  };

  return [...apps].sort(
    (a, b) =>
      (order[normalizeStatus(a.status)] ?? 99) -
      (order[normalizeStatus(b.status)] ?? 99)
  );
};


export const canScheduleInterview = (applicationStatus) =>
  applicationStatus === ApplicationStatus.APPROVED;

export const canUpdateInterviewResult = (interviewStatus) =>
  interviewStatus === InterviewStatus.SCHEDULED;

export const canCreatePlacement = (interviewStatus, interviewResult) =>
  interviewStatus === InterviewStatus.COMPLETED &&
  interviewResult === InterviewResult.SHORTLISTED;