

const TOKEN_KEY = 'workforce_token';
const ROLE_KEY = 'workforce_role';
const USERNAME_KEY = 'workforce_username'; // ✅ Added constant for username
const JOB_SEEKER_ID_KEY = 'workforce_jobSeekerId';
const EMPLOYER_ID_KEY = 'workforce_employerId';
export const saveAuthData = (authResponse) => {
  if (!authResponse) return;

  const { token, role, username, jobSeekerId, employerId } = authResponse;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  }
  if (username) {
    localStorage.setItem(USERNAME_KEY, username);
  }

  if (jobSeekerId) {
    localStorage.setItem(JOB_SEEKER_ID_KEY, jobSeekerId);
  }

  if (employerId) {
    localStorage.setItem(EMPLOYER_ID_KEY, employerId);
  }
};


export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRole = () => {
  return localStorage.getItem(ROLE_KEY);
};


export const getUsername = () => {
  return localStorage.getItem(USERNAME_KEY);
};


export const getJobSeekerId = () => {
  return localStorage.getItem(JOB_SEEKER_ID_KEY);
};

export const getEmployerId = () => {
  return localStorage.getItem(EMPLOYER_ID_KEY);
};


export const isAuthenticated = () => {
  return getToken() !== null;
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(JOB_SEEKER_ID_KEY);
  localStorage.removeItem(EMPLOYER_ID_KEY);
};