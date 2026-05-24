import axiosInstance from './axiosConfig';

export const getTrainingPrograms = async () => {
  return axiosInstance.get('/training-programs');
};

export const createTrainingProgram = async (data) => {
  return axiosInstance.post('/training-programs', data);
};

export const getEnrollmentsByProgram = async (programId) => {
  return axiosInstance.get(`/enrollments/program/${programId}`);
};


export const updateEnrollmentStatus = async (enrollmentId, status) => {
  if (!enrollmentId || !status) {
    throw new Error('Enrollment ID and status are required');
  }

  return axiosInstance.patch(
    `/enrollments/${enrollmentId}/status`,
    null,
    {
      params: { status },
    }
  );
};
export const updateTrainingProgramStatus = async (programId) => {
  if (!programId) {
    throw new Error('Program ID is required');
  }

  return axiosInstance.patch(`/training-programs/${programId}`);
};
export const getTrainingReport = async () => {
  return axiosInstance.get('/reports/training');
};