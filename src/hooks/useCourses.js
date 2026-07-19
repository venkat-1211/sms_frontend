import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import courseService from '../api/courseService';
import { toast } from 'react-toastify';

export const useCourses = (initialFilters = {}) => {
  const [courses, setCourses] = useState([]);
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

  const fetchCourses = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page: page || 1,
        per_page: pagination.per_page || 15,
        ...filters,
      };
      
      const response = await courseService.getAll(params);
      
      if (response.success) {
        setCourses(response.data || []);
        
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
        toast.error(response.message || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Fetch courses error:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.per_page]);

  const searchCourses = useCallback(debounce((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, 500), []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchCourses(page);
    }
  };

  const handlePerPageChange = (perPage) => {
    setPagination(prev => ({ ...prev, per_page: perPage }));
    setTimeout(() => fetchCourses(1), 100);
  };

  const createCourse = async (data) => {
    try {
      const response = await courseService.create(data);
      if (response.success) {
        toast.success('Course created successfully');
        await fetchCourses(pagination.current_page);
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to create course');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Create course error:', error);
      toast.error(error.response?.data?.message || 'Failed to create course');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateCourse = async (id, data) => {
    try {
      const response = await courseService.update(id, data);
      if (response.success) {
        toast.success('Course updated successfully');
        await fetchCourses(pagination.current_page);
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Failed to update course');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Update course error:', error);
      toast.error(error.response?.data?.message || 'Failed to update course');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const deleteCourse = async (id) => {
    try {
      const response = await courseService.delete(id);
      if (response.success) {
        toast.success('Course deleted successfully');
        await fetchCourses(pagination.current_page);
        return { success: true };
      } else {
        toast.error(response.message || 'Failed to delete course');
        return { success: false };
      }
    } catch (error) {
      console.error('Delete course error:', error);
      toast.error('Failed to delete course');
      return { success: false };
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await courseService.toggleStatus(id);
      if (response.success) {
        toast.success('Course status updated');
        await fetchCourses(pagination.current_page);
        return { success: true };
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Failed to update status');
      return { success: false };
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    pagination,
    filters,
    setFilters,
    fetchCourses,
    searchCourses,
    handlePageChange,
    handlePerPageChange,
    createCourse,
    updateCourse,
    deleteCourse,
    toggleStatus,
  };
};