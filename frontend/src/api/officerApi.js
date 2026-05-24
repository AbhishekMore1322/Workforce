import axiosInstance from './axiosConfig';

export const getAllJobSeekers = async () => {
  return axiosInstance.get('/jobseekers');
};

export const updateJobSeekerStatus = async (seekerId, status) => {
  return axiosInstance.patch(`/jobseekers/${seekerId}/status?status=${status}`);
};

export const getAllEmployers = async () => {
  return axiosInstance.get('/employers');
};

export const updateEmployerStatus = async (employerId, status) => {
  return axiosInstance.patch(`/employers/${employerId}/status?status=${status}`);
};

export const getAllApplications = async () => {
  return axiosInstance.get('/applications');
};

export const updateApplicationStatus = async (applicationId, status) => {
  return axiosInstance.patch(`/applications/${applicationId}/status?status=${status}`);
};

export const addApplicationNote = async (applicationId, notes) => {
  return axiosInstance.post(`/applications/${applicationId}/notes`, { notes });
};

export const postComplianceCheck = async ({ entityID, type, notes }) => {
  return axiosInstance.post('/compliance/check', { entityID, type,result, notes });
};

export const getComplianceReports = async () => {
  return axiosInstance.get('/compliance/reports');
};

export const getAllPlacements = async () => {
  return axiosInstance.get('/placements');
};

export const getEnrollmentsByProgram = async (programId) => {
  return axiosInstance.get(`/enrollments/program/${programId}`);
};

export const updatePlacementStatus = async (placementId, status) => {
  return axiosInstance.patch(`/placements/${placementId}/status?status=${status}`);
};
