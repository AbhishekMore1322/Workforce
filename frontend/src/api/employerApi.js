import axiosInstance from './axiosConfig';

export const registerEmployer = async (data) => {
  if (!data) throw new Error('Registration data is required');
  
  // Validate required fields
  if (!data.name || data.name.trim() === '') {
    throw new Error('Company name is required');
  }
  if (!data.industry || data.industry.trim() === '') {
    throw new Error('Industry is required');
  }
  if (!data.contactInfo || data.contactInfo.trim() === '') {
    throw new Error('Contact email is required');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.contactInfo)) {
    throw new Error('Please enter a valid email address');
  }

  return axiosInstance.post('/employers/register', {
    name: data.name.trim(),
    industry: data.industry.trim(),
    contactInfo: data.contactInfo.trim(),
  });
};
export const getEmployerProfile = async (employerId) => {
  if (!employerId) throw new Error('Employer ID is required');
  return axiosInstance.get(`/employers/${employerId}`);
};

export const updateEmployerProfile = async (employerId, payload) => {
  if (!employerId) throw new Error('Employer ID is required');
  if (!payload) throw new Error('Update payload is required');
  return axiosInstance.put(`/employers/${employerId}`, payload);
};

export const deleteEmployerAccount = async (employerId) => {
  if (!employerId) throw new Error('Employer ID is required');
  return axiosInstance.delete(`/employers/${employerId}`);
};

export const createJobPosting = async (payload) => {
  if (!payload) throw new Error('Job posting data is required');
  return axiosInstance.post('/jobs', payload);
};

export const getJobPostingById = async (jobId) => {
  if (!jobId) throw new Error('Job ID is required');
  return axiosInstance.get(`/jobs/${jobId}`);
};

export const updateJobPosting = async (jobId, payload) => {
  if (!jobId) throw new Error('Job ID is required');
  if (!payload) throw new Error('Job update payload is required');
  return axiosInstance.put(`/jobs/${jobId}`, payload);
};

export const updateJobStatus = async (jobId, status) => {
  if (!jobId) throw new Error('Job ID is required');
  if (!status) throw new Error('Job status is required');

  return axiosInstance.patch(`/jobs/${jobId}/status`, null, {
    params: { status },
  });
};

export const deleteJobPosting = async (jobId) => {
  if (!jobId) throw new Error('Job ID is required');
  return axiosInstance.delete(`/jobs/${jobId}`);
};


export const getAllJobPostings = async () => {
  return axiosInstance.get('/jobs');
};

export const createJob = createJobPosting;
export const updateJob = updateJobPosting;
export const closeJob = async (jobId) =>
  updateJobStatus(jobId, 'CLOSED');

export const getApplicationsByJob = async (jobId) => {
  if (!jobId) throw new Error('Job ID is required');
  return axiosInstance.get(`/applications/job/${jobId}`);
};

export const updateApplicationStatus = async (applicationId, status) => {
  if (!applicationId) throw new Error('Application ID is required');
  if (!status) throw new Error('Status is required');

  return axiosInstance.patch(`/applications/${applicationId}/status`, null, {
    params: { status },
  });
};

export const addApplicationNote = async (applicationId, notes) => {
  if (!applicationId) throw new Error('Application ID is required');
  if (!notes) throw new Error('Notes are required');

  return axiosInstance.post(`/applications/${applicationId}/notes`, {
    notes,
  });
};

export const scheduleInterview = async (payload) => {
  if (!payload) throw new Error('Interview payload is required');
  return axiosInstance.post('/interviews/schedule', payload);
};

export const getInterviewById = async (interviewId) => {
  if (!interviewId) throw new Error('Interview ID is required');
  return axiosInstance.get(`/interviews/${interviewId}`);
};

export const updateInterviewStatus = async (interviewId, payload) => {
  if (!interviewId) throw new Error('Interview ID is required');
  if (!payload) throw new Error('Interview update payload is required');

  return axiosInstance.patch(`/interviews/${interviewId}/status`, payload);
};

export const deleteInterview = async (interviewId) => {
  if (!interviewId) throw new Error('Interview ID is required');
  return axiosInstance.delete(`/interviews/${interviewId}`);
};

export const createPlacement = async (payload) => {
  if (!payload) throw new Error('Placement payload is required');
  return axiosInstance.post('/placements/create', payload);
};

export const getAllPlacements = async () => {
  return axiosInstance.get('/placements');
};

export const getEmployerInterviews = async () => {
  return axiosInstance.get('/interviews/employer/me');
};

export const getLatestResume = async (jobSeekerId) => {
  return axiosInstance.get(`/jobseekers/${jobSeekerId}/documents/resume/latest`);
};
