import apiClient from './apiClient';

const dashboardService = {
  getDashboard: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  clearCache: async () => {
    const response = await apiClient.post('/dashboard/clear-cache');
    return response.data;
  },
};

export default dashboardService;