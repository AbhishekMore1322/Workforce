import axios from 'axios';
import { getToken, clearAuthData } from '../utils/tokenStorage';

const getBackendUrl = () => import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.baseURL = getBackendUrl();
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
  
    return response.data?.data !== undefined
      ? response.data.data
      : response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = '/login';
      return Promise.reject(
        new Error('Session expired. Please login again.')
      );
    }

    if (error.response?.data?.message) {
      return Promise.reject(
        new Error(error.response.data.message)
      );
    }
    return Promise.reject(
      new Error(error.message || 'An error occurred')
    );
  }
);

export default axiosInstance;