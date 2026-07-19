import apiClient from './apiClient';

const courseService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/courses', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/courses', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/courses/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/courses/${id}`);
    return response.data;
  },

  search: async (query, params = {}) => {
    const response = await apiClient.get('/courses/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/courses/stats');
    return response.data;
  },

  getPopular: async (limit = 5) => {
    const response = await apiClient.get('/courses/popular', { params: { limit } });
    return response.data;
  },

  getActive: async () => {
    const response = await apiClient.get('/courses/active');
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await apiClient.post(`/courses/${id}/toggle-status`);
    return response.data;
  },
};

export default courseService;