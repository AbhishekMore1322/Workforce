import axiosInstance from './axiosConfig';
import { getJobSeekerId } from '../utils/tokenStorage';

export const registerJobSeeker = async (data) => {
  if (!data) {
    throw new Error('Registration data is required');
  }

  // Validate required fields
  if (!data.name || data.name.trim() === '') {
    throw new Error('Full name is required');
  }
  if (!data.dob) {
    throw new Error('Date of birth is required');
  }
  if (!data.gender) {
    throw new Error('Gender is required');
  }
  if (!data.address || data.address.trim() === '') {
    throw new Error('Address is required');
  }
  if (!data.contactInfo || data.contactInfo.trim() === '') {
    throw new Error('Contact email is required');
  }
  if (!data.skillsJSON || data.skillsJSON.trim() === '') {
    throw new Error('Skills are required');
  }
 
  const payload = {
    name: data.name.trim(),
    dob: data.dob,
    gender: data.gender,
    address: data.address.trim(),
    contactInfo: data.contactInfo.trim(),
    skillsJSON: data.skillsJSON.trim(),
  };
 
  try {
    const response = await axiosInstance.post(
      '/jobseekers/register',
      payload
    );
    
    // Validate response structure
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response from server');
    }
    
    return response;
  } catch (error) {
    // Re-throw with more context if validation error
    if (error.message && error.message.includes('validation')) {
      throw new Error(`Validation failed: ${error.message}`);
    }
    throw error;
  }
};

export const getMyProfile = async () => {
  const jobSeekerId = getJobSeekerId();
  if (!jobSeekerId) throw new Error('Missing jobSeekerId');
 
  return axiosInstance.get(`/jobseekers/${jobSeekerId}`);
};

export const updateMyProfile = async (payload) => {
  const jobSeekerId = getJobSeekerId();
  if (!jobSeekerId) throw new Error('Missing jobSeekerId');
 
  return axiosInstance.put(`/jobseekers/${jobSeekerId}`, payload);
};

export const deleteJobSeekerProfile = async () => {
  const jobSeekerId = getJobSeekerId();
  if (!jobSeekerId) throw new Error('Missing jobSeekerId');
 
  return axiosInstance.delete(`/jobseekers/${jobSeekerId}`);
};
 
export const getActiveTrainingPrograms = async () => {
  const programs = await axiosInstance.get('/training-programs');
  return Array.isArray(programs)
    ? programs.filter((p) => String(p.status).toUpperCase() === 'ACTIVE')
    : [];
};


export const getAllTrainingPrograms = async () => {
  const programs = await axiosInstance.get('/training-programs');
  return Array.isArray(programs) ? programs : [];
};

export const getTrainingProgramById = async (programId) => {
  if (!programId) throw new Error('programId is required');

  return axiosInstance.get(`/training-programs/${programId}`);
};

export const enrollInTrainingProgram = async (programId) => {
  if (!programId) {
    throw new Error('programId is required');
  }

  const seekerID = getJobSeekerId();
  if (!seekerID || Number.isNaN(Number(seekerID))) {
    throw new Error('Invalid job seeker identity. Please re-login.');
  }

  return axiosInstance.post(
    `/training-programs/${programId}/enroll`,
    { seekerID }
  );
};

export const getMyEnrollments = async () => {
  const jobSeekerId = getJobSeekerId();
  if (!jobSeekerId) throw new Error('Missing jobSeekerId');

  const data = await axiosInstance.get(`/enrollments/jobseeker/${jobSeekerId}`);
  return Array.isArray(data) ? data : [];
};
 
export const getMyDocuments = async () => {
  const jobSeekerId = getJobSeekerId();
  if (!jobSeekerId) throw new Error('Missing jobSeekerId');
 
  return axiosInstance.get(`/jobseekers/${jobSeekerId}/documents`);
};

export const deleteDocument = async (docId) => {
  const jobSeekerId = getJobSeekerId();
  if (!jobSeekerId) throw new Error('Missing jobSeekerId');
  if (!docId) throw new Error('docId is required');

  return axiosInstance.delete(`/jobseekers/${jobSeekerId}/documents/${docId}`);
};

export const updateMySkills = async (skillsJSON) => {
  const jobSeekerId = getJobSeekerId();
  if (!jobSeekerId) throw new Error('Missing jobSeekerId');

  return axiosInstance.patch(`/jobseekers/${jobSeekerId}/skills`, { skillsJSON });
};
export const uploadJobSeekerDocumentLinkBased = async ({
  docType,
  fileURI,
}) => {
  const jobSeekerId = getJobSeekerId();
  if (!jobSeekerId) throw new Error('Missing jobSeekerId');
  if (!docType) throw new Error('docType is required');
  if (!fileURI) throw new Error('fileURI is required');
 
  return axiosInstance.post(
    `/jobseekers/${jobSeekerId}/documents`,
    { docType, fileURI }
  );
};
 
export const getMyApplications = async () => {
  const jobSeekerId = getJobSeekerId();
  if (!jobSeekerId) throw new Error('Missing jobSeekerId');
 
  return axiosInstance.get(
    `/applications/jobseeker/${jobSeekerId}`
  );
};

export const getAllJobPostings = async () => {
  return axiosInstance.get('/jobs');
};

export const searchJobPostings = async (keyword) => {
  if (!keyword || !keyword.trim()) return axiosInstance.get('/jobs');
  return axiosInstance.get(`/jobs/search?keyword=${encodeURIComponent(keyword.trim())}`);
};

export const getJobPostingById = async (jobId) => {
  if (!jobId) throw new Error('jobId is required');
  return axiosInstance.get(`/jobs/${jobId}`);
};
 
export const applyToJob = async (jobId) => {
  const jobSeekerId = getJobSeekerId();
  if (!jobSeekerId) throw new Error('Missing jobSeekerId');
  if (!jobId) throw new Error('jobId is required');
 
  return axiosInstance.post('/applications/apply', {
    seekerID: jobSeekerId,
    jobID: jobId,
  });
};

export const getApplicationsByJobAndSeeker = async (jobId) => {
  const jobSeekerId = getJobSeekerId();
  if (!jobSeekerId) throw new Error('Missing jobSeekerId');
  if (!jobId) throw new Error('jobId is required');

  const data = await axiosInstance.get(`/applications/job/${jobId}`);

  const apps = Array.isArray(data) ? data : data?.data;
  if (!Array.isArray(apps)) return [];

  return apps.filter((a) => {
    const seekerId = a?.seekerID ?? a?.seekerId ?? a?.jobSeekerId ?? a?.jobseekerID;
    return seekerId != null && String(seekerId) === String(jobSeekerId);
  });
};
 

 
 