import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import studentService from '../api/studentService';
import { toast } from 'react-toastify';

export const useStudents = (initialFilters = {}) => {
  const [students, setStudents] = useState([]);
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

  const fetchStudents = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page || 1,
        per_page: pagination.per_page || 15,
        ...filters,
      };
      
      const response = await studentService.getAll(params);
      
      if (response.success) {
        setStudents(response.data || []);
        
        // Set pagination from response meta
        if (response.meta) {
          setPagination({
            current_page: response.meta.current_page || 1,
            last_page: response.meta.last_page || 1,
            per_page: response.meta.per_page || 15,
            total: response.meta.total || 0,
            from: response.meta.from || 0,
            to: response.meta.to || 0,
          });
        } else {
          // Fallback if meta is not in response
          console.warn('Pagination meta not found in response:', response);
        }
      } else {
        toast.error(response.message || 'Failed to fetch students');
      }
    } catch (error) {
      console.error('Fetch students error:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.per_page]);

  const searchStudents = useCallback(debounce((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, 500), []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchStudents(page);
    }
  };

  const handlePerPageChange = (perPage) => {
    setPagination(prev => ({ ...prev, per_page: perPage }));
    setFilters(prev => ({ ...prev }));
    // Fetch with new per_page value
    setTimeout(() => fetchStudents(1), 100);
  };

  const createStudent = async (data) => {
    try {
      const response = await studentService.create(data);
      if (response.success) {
        toast.success('Student created successfully');
        await fetchStudents(pagination.current_page);
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to create student');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Create student error:', error);
      toast.error(error.response?.data?.message || 'Failed to create student');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateStudent = async (id, data) => {
    try {
      const response = await studentService.update(id, data);
      if (response.success) {
        toast.success('Student updated successfully');
        await fetchStudents(pagination.current_page);
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to update student');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Update student error:', error);
      toast.error(error.response?.data?.message || 'Failed to update student');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const deleteStudent = async (id) => {
    try {
      const response = await studentService.delete(id);
      if (response.success) {
        toast.success('Student deleted successfully');
        await fetchStudents(pagination.current_page);
        return { success: true };
      } else {
        toast.error(response.message || 'Failed to delete student');
        return { success: false };
      }
    } catch (error) {
      console.error('Delete student error:', error);
      toast.error('Failed to delete student');
      return { success: false };
    }
  };

  const bulkDeleteStudents = async (ids) => {
    try {
      const response = await studentService.bulkDelete(ids);
      if (response.success) {
        toast.success(response.message || 'Students deleted successfully');
        await fetchStudents(pagination.current_page);
        return { success: true };
      }
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error('Failed to delete students');
      return { success: false };
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await studentService.toggleStatus(id);
      if (response.success) {
        toast.success('Student status updated');
        await fetchStudents(pagination.current_page);
        return { success: true };
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Failed to update status');
      return { success: false };
    }
  };

  const exportStudents = async (params = {}) => {
    try {
      const response = await studentService.export({ ...filters, ...params });
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export students');
      return null;
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    pagination,
    filters,
    setFilters,
    fetchStudents,
    searchStudents,
    handlePageChange,
    handlePerPageChange,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkDeleteStudents,
    toggleStatus,
    exportStudents,
  };
};