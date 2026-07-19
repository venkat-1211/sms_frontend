import apiClient from './apiClient';

const admissionService = {
  getAll: async (params = {}) => {
    try {
      const response = await apiClient.get('/admissions', { params });
      return response.data;
    } catch (error) {
      console.error('Get all admissions error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/admissions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get admission by id error:', error);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await apiClient.post('/admissions', data);
      return response.data;
    } catch (error) {
      console.error('Create admission error:', error);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/admissions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update admission error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/admissions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete admission error:', error);
      throw error;
    }
  },

  search: async (query, params = {}) => {
    try {
      const response = await apiClient.get('/admissions/search', { 
        params: { q: query, ...params } 
      });
      return response.data;
    } catch (error) {
      console.error('Search admissions error:', error);
      throw error;
    }
  },

  payFee: async (id, amount) => {
    try {
      const response = await apiClient.post(`/admissions/${id}/pay`, { amount });
      return response.data;
    } catch (error) {
      console.error('Pay fee error:', error);
      throw error;
    }
  },

  getStats: async () => {
    try {
      const response = await apiClient.get('/admissions/stats');
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  },

  getRevenue: async () => {
    try {
      const response = await apiClient.get('/admissions/revenue');
      return response.data;
    } catch (error) {
      console.error('Get revenue error:', error);
      throw error;
    }
  },

  getRecent: async (limit = 5) => {
    try {
      const response = await apiClient.get('/admissions/recent', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Get recent admissions error:', error);
      throw error;
    }
  },

  getPaymentDistribution: async () => {
    try {
      const response = await apiClient.get('/admissions/payment-distribution');
      return response.data;
    } catch (error) {
      console.error('Get payment distribution error:', error);
      throw error;
    }
  },

  getMonthlyRevenue: async (months = 12) => {
    try {
      const response = await apiClient.get('/admissions/monthly-revenue', { 
        params: { months } 
      });
      return response.data;
    } catch (error) {
      console.error('Get monthly revenue error:', error);
      throw error;
    }
  },

  getByStudent: async (studentId) => {
    try {
      const response = await apiClient.get(`/admissions/by-student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Get admissions by student error:', error);
      throw error;
    }
  },

  getByCourse: async (courseId) => {
    try {
      const response = await apiClient.get(`/admissions/by-course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Get admissions by course error:', error);
      throw error;
    }
  },

  toggleStatus: async (id) => {
    try {
      const response = await apiClient.post(`/admissions/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Toggle status error:', error);
      throw error;
    }
  },

  export: async (params = {}) => {
    try {
      const response = await apiClient.get('/admissions/export', { params });
      return response.data;
    } catch (error) {
      console.error('Export admissions error:', error);
      throw error;
    }
  },
};

export default admissionService;