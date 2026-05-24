import axiosInstance from './axiosConfig';

export const getAllEmployers = async () => {
  const response = await axiosInstance.get('/employers');
  return response;
};

export const updateEmployerStatus = async (employerId, status) => {
  if (!employerId || !status) {
    throw new Error('Employer ID and status are required');
  }

  const response = await axiosInstance.patch(
    `/employers/${employerId}/status`,
    null,
    { params: { status } }
  );
  return response;
};
export const getAllJobSeekers = async () => {
  const response = await axiosInstance.get('/jobseekers');
  return response;
};
export const getJobSeekerDocuments = async (jobSeekerId) => {
  if (!jobSeekerId) {
    throw new Error('Job seeker ID is required');
  }

  const response = await axiosInstance.get(
    `/jobseekers/${jobSeekerId}/documents`
  );
  return response;
};
export const updateJobSeekerStatus = async (seekerId, status) => {
  if (!seekerId || !status) {
    throw new Error('Job seeker ID and status are required');
  }

  const response = await axiosInstance.patch(
    `/jobseekers/${seekerId}/status`,
    null,
    { params: { status } }
  );
  return response;
};

export const getApplicationsByJobSeeker = async (jobSeekerId) => {
  if (!jobSeekerId) {
    throw new Error('Job seeker ID is required');
  }

  const response = await axiosInstance.get(
    `/applications/jobseeker/${jobSeekerId}`
  );
  return response;
};

export const getAllApplications = async () => {
  const response = await axiosInstance.get('/applications');
  return response;
};

export const getAllPlacements = async () => {
  const response = await axiosInstance.get('/placements');
  return response || [];
};

export const updatePlacementStatus = async (placementId, status) => {
  if (!placementId || !status) {
    throw new Error('Placement ID and status are required');
  }

  const response = await axiosInstance.patch(
    `/placements/${placementId}/status`,
    null,
    { params: { status } }
  );
  return response;
};

export const deletePlacement = async (placementId) => {
  if (!placementId) {
    throw new Error('Placement ID is required');
  }

  await axiosInstance.delete(`/placements/${placementId}`);
  return true;
};

export const getAllTrainingPrograms = async () => {
  const response = await axiosInstance.get('/training-programs');
  return response;
};

export const getTrainingProgramById = async (programId) => {
  if (!programId) {
    throw new Error('Program ID is required');
  }

  const response = await axiosInstance.get(
    `/training-programs/${programId}`
  );
  return response;
};

export const getEnrollmentsByProgram = async (programId) => {
  if (!programId) {
    throw new Error('Program ID is required');
  }

  const response = await axiosInstance.get(
    `/enrollments/program/${programId}`
  );
  return response || [];
};

export const updateEnrollmentStatus = async (enrollmentId, status) => {
  if (!enrollmentId || !status) {
    throw new Error('Enrollment ID and status are required');
  }

  const response = await axiosInstance.patch(
    `/enrollments/${enrollmentId}/status`,
    null,
    { params: { status } }
  );
  return response;
};

export const getJobApplicationsReport = async () => {
  const response = await axiosInstance.get('/reports/job-applications');
  return response;
};

export const getEmployersReport = async () => {
  const response = await axiosInstance.get('/reports/employers');
  return response;
};

export const getPlacementsReport = async () => {
  const response = await axiosInstance.get('/reports/placements');
  return response;
};

export const getTrainingReport = async () => {
  const response = await axiosInstance.get('/reports/training');
  return response;
};

export const getComplianceReport = async () => {
  const response = await axiosInstance.get('/reports/compliance');
  return response;
};