import apiClient from './apiClient';

const authService = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  googleLogin: async (token) => {
    const response = await apiClient.post('/auth/google', { token });
    return response.data;
  },

  getGoogleUrl: async () => {
    const response = await apiClient.get('/auth/google-url');
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  revokeAllTokens: async () => {
    const response = await apiClient.post('/auth/revoke-all-tokens');
    return response.data;
  },

  checkAuth: async () => {
    const response = await apiClient.get('/auth/check');
    return response.data;
  },
};

export default authService;