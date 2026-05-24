import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getNotificationsByUser = async (username, token) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/notifications/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    const notifications = response?.data?.data;
    return Array.isArray(notifications) ? notifications : [];
  } catch (error) {
    console.error('Get notifications error:', error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      'Failed to fetch notifications'
    );
  }
};