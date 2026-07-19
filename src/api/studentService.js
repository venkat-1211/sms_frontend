import apiClient from './apiClient';

const studentService = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/students', { params });
      return response.data;
    } catch (error) {
      console.error('Get all students error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get student by id error:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/students', data);
      return response.data;
    } catch (error) {
      console.error('Create student error:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/students/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update student error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete student error:', error);
      throw error;
    }
  },

  search: async (query, params = {}) => {
    try {
      const response = await apiClient.get('/students/search', { 
        params: { q: query, ...params } 
      });
      return response.data;
    } catch (error) {
      console.error('Search students error:', error);
      throw error;
    }
  },

  bulkDelete: async (ids) => {
    try {
      const response = await apiClient.post('/students/bulk-delete', { ids });
      return response.data;
    } catch (error) {
      console.error('Bulk delete error:', error);
      throw error;
    }
  },

  export: async (params = {}) => {
    try {
      const response = await apiClient.get('/students/export', { params });
      return response.data;
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await apiClient.get('/students/stats');
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  },

  getRecent: async (limit = 5) => {
    try {
      const response = await apiClient.get('/students/recent', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Get recent error:', error);
      throw error;
    }
  },

  getGenderDistribution: async () => {
    try {
      const response = await apiClient.get('/students/gender-distribution');
      return response.data;
    } catch (error) {
      console.error('Get gender distribution error:', error);
      throw error;
    }
  },

  getByCourse: async (courseId) => {
    try {
      const response = await apiClient.get(`/students/by-course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Get by course error:', error);
      throw error;
    }
  },

  toggleStatus: async (id) => {
    try {
      const response = await apiClient.post(`/students/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Toggle status error:', error);
      throw error;
    }
  },
};

export default studentService;