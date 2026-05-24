import axiosInstance from './axiosConfig';

export const createAudit = async (payload) => {
  return axiosInstance.post('/audits/create', payload);
};

export const getAllAudits = async () => {
  return axiosInstance.get('/audits');
};

export const getAuditById = async (auditId) => {
  return axiosInstance.get(`/audits/${auditId}`);
};

export const getJobApplicationAnalytics = async () => {
  return axiosInstance.get('/reports/job-applications');
};

export const getTrainingAnalytics = async () => {
  return axiosInstance.get('/reports/training');
};

export const getPlacementAnalytics = async () => {
  return axiosInstance.get('/reports/placements');
};

export const getComplianceAnalytics = async () => {
  return axiosInstance.get('/reports/compliance');
};

