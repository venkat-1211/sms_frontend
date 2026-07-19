import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import courseService from '../../api/courseService';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const courseSchema = yup.object().shape({
  course_name: yup.string()
    .required('Course name is required')
    .min(2, 'Course name must be at least 2 characters')
    .max(255, 'Course name is too long'),
  duration: yup.number()
    .required('Duration is required')
    .min(1, 'Duration must be at least 1 month')
    .max(60, 'Duration cannot exceed 60 months')
    .integer('Duration must be a whole number'),
  total_fee: yup.number()
    .required('Total fee is required')
    .min(0, 'Total fee cannot be negative')
    .max(999999.99, 'Total fee is too high'),
  status: yup.number()
    .default(1)
    .oneOf([0, 1], 'Invalid status'),
});

const CourseForm = ({ edit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(edit);
  const [error, setError] = useState(null);

  const methods = useForm({
    resolver: yupResolver(courseSchema),
    defaultValues: {
      course_name: '',
      duration: '',
      total_fee: '',
      status: 1,
    },
  });

  const { reset } = methods;

  useEffect(() => {
    if (edit && id) {
      loadCourseData();
    } else {
      setInitialLoading(false);
    }
  }, [edit, id]);

  const loadCourseData = async () => {
    setInitialLoading(true);
    setError(null);
    try {
      // Use courseService.getById directly
      const response = await courseService.getById(parseInt(id));
      
      if (response.success && response.data) {
        const course = response.data;
        
        // Reset form with course data
        reset({
          course_name: course.course_name || '',
          duration: course.duration || '',
          total_fee: course.total_fee || '',
          status: course.status !== undefined ? course.status : 1,
        });

        console.log('Course data loaded successfully:', course);
      } else {
        setError('Course not found');
        toast.error('Course not found');
      }
    } catch (err) {
      console.error('Failed to load course:', err);
      setError('Failed to load course data');
      toast.error('Failed to load course data');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      // Format data before submission
      const formData = {
        ...data,
        duration: parseInt(data.duration),
        total_fee: parseFloat(data.total_fee),
        status: parseInt(data.status) || 1,
      };

      let result;
      if (edit) {
        result = await courseService.update(parseInt(id), formData);
      } else {
        result = await courseService.create(formData);
      }

      if (result.success) {
        toast.success(edit ? 'Course updated successfully!' : 'Course created successfully!');
        navigate('/courses');
      } else {
        setError(result.message || 'Failed to save course');
        toast.error(result.message || 'Failed to save course');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('An error occurred while saving');
      toast.error(err.response?.data?.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  if (initialLoading) {
    return <LoadingSpinner fullPage message="Loading course data..." />;
  }

  if (error && edit) {
    return (
      <div className="container-fluid py-4">
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-1 d-block mb-3"></i>
            <h4 className="text-danger">Error Loading Course</h4>
            <p className="text-muted">{error}</p>
            <button 
              className="btn btn-primary me-2"
              onClick={loadCourseData}
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              Retry
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{edit ? 'Edit Course' : 'Create New Course'}</h4>
        <button 
          className="btn btn-secondary" 
          onClick={handleCancel}
          type="button"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {error && !edit && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-12 mb-3">
                  <FormInput
                    name="course_name"
                    label="Course Name"
                    placeholder="Enter course name"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <FormInput
                    name="duration"
                    label="Duration (Months)"
                    type="number"
                    placeholder="Enter duration in months"
                    required
                    min="1"
                    max="60"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <FormInput
                    name="total_fee"
                    label="Total Fee ($)"
                    type="number"
                    step="0.01"
                    placeholder="Enter total fee"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <FormSelect
                    name="status"
                    label="Status"
                    options={statusOptions}
                    placeholder="Select status"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {edit ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <i className={`bi ${edit ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
                      {edit ? 'Update Course' : 'Create Course'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;