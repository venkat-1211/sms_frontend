import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import admissionService from '../api/admissionService';
import { toast } from 'react-toastify';

export const useAdmissions = (initialFilters = {}) => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
  });
  const [filters, setFilters] = useState(initialFilters);

  const fetchAdmissions = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page || 1,
        per_page: pagination.per_page || 15,
        ...filters,
      };
      
      const response = await admissionService.getAll(params);
      
      if (response.success) {
        setAdmissions(response.data || []);
        
        if (response.meta) {
          setPagination({
            current_page: response.meta.current_page || 1,
            last_page: response.meta.last_page || 1,
            per_page: response.meta.per_page || 15,
            total: response.meta.total || 0,
            from: response.meta.from || 0,
            to: response.meta.to || 0,
          });
        }
      } else {
        toast.error(response.message || 'Failed to fetch admissions');
      }
    } catch (error) {
      console.error('Fetch admissions error:', error);
      toast.error('Failed to fetch admissions');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.per_page]);

  const searchAdmissions = useCallback(debounce((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, 500), []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchAdmissions(page);
    }
  };

  const handlePerPageChange = (perPage) => {
    setPagination(prev => ({ ...prev, per_page: perPage }));
    setTimeout(() => fetchAdmissions(1), 100);
  };

  const createAdmission = async (data) => {
    try {
      const response = await admissionService.create(data);
      if (response.success) {
        toast.success('Admission created successfully');
        await fetchAdmissions(pagination.current_page);
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to create admission');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Create admission error:', error);
      toast.error(error.response?.data?.message || 'Failed to create admission');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateAdmission = async (id, data) => {
    try {
      const response = await admissionService.update(id, data);
      if (response.success) {
        toast.success('Admission updated successfully');
        await fetchAdmissions(pagination.current_page);
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to update admission');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Update admission error:', error);
      toast.error(error.response?.data?.message || 'Failed to update admission');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const deleteAdmission = async (id) => {
    try {
      const response = await admissionService.delete(id);
      if (response.success) {
        toast.success('Admission deleted successfully');
        await fetchAdmissions(pagination.current_page);
        return { success: true };
      } else {
        toast.error(response.message || 'Failed to delete admission');
        return { success: false };
      }
    } catch (error) {
      console.error('Delete admission error:', error);
      toast.error('Failed to delete admission');
      return { success: false };
    }
  };

  const payFee = async (id, amount) => {
    try {
      const response = await admissionService.payFee(id, amount);
      if (response.success) {
        toast.success('Payment made successfully');
        await fetchAdmissions(pagination.current_page);
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to make payment');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Pay fee error:', error);
      toast.error('Failed to make payment');
      return { success: false };
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await admissionService.toggleStatus(id);
      if (response.success) {
        toast.success('Admission status updated');
        await fetchAdmissions(pagination.current_page);
        return { success: true };
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Failed to update status');
      return { success: false };
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  return {
    admissions,
    loading,
    pagination,
    filters,
    setFilters,
    fetchAdmissions,
    searchAdmissions,
    handlePageChange,
    handlePerPageChange,
    createAdmission,
    updateAdmission,
    deleteAdmission,
    payFee,
    toggleStatus,
  };
};