import axiosInstance from './axiosConfig';

// ✅ SIGNUP
export const signup = async (name, email, username, password, role) => {
  try {
    const data = await axiosInstance.post('/auth/signup', {
      name,
      email,
      username,
      password,
      role,
    });

    console.log('Signup response:', data);

    return {
      success: true,
      message: data
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// ✅ LOGIN
export const login = async (username, password) => {
  try {
    const data = await axiosInstance.post('/auth/login', {
      username,
      password,
    });

    console.log('Login response:', data);

    return data;  // ✅ DIRECT CLEAN RESPONSE
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// ✅ LOGOUT
export const logout = async () => {
  try {
    const data = await axiosInstance.post('/auth/logout');
    return data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// ✅ FORGOT PASSWORD
export const forgotPassword = async (email) => {
  try {
    return await axiosInstance.post('/auth/forgot-password', { email });
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

// ✅ RESET PASSWORD
export const resetPassword = async (username, token, newPassword) => {
  try {
    return await axiosInstance.post('/auth/reset-password', {
      username,
      token,
      newPassword,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};