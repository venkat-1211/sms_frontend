import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import admissionService from '../../api/admissionService';
import studentService from '../../api/studentService';
import courseService from '../../api/courseService';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormDatePicker from '../../components/forms/FormDatePicker';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

// Updated schema - removed max date validation for editing
const admissionSchema = yup.object().shape({
  student_id: yup.number()
    .required('Student is required')
    .positive('Invalid student selection'),
  course_id: yup.number()
    .required('Course is required')
    .positive('Invalid course selection'),
  admission_date: yup.date()
    .required('Admission date is required'),
  total_fee: yup.number()
    .required('Total fee is required')
    .min(0, 'Total fee cannot be negative'),
  amount_paid: yup.number()
    .required('Amount paid is required')
    .min(0, 'Amount paid cannot be negative')
    .max(yup.ref('total_fee'), 'Amount paid cannot exceed total fee'),
  status: yup.number()
    .default(1)
    .oneOf([0, 1], 'Invalid status'),
});

const AdmissionForm = ({ edit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const methods = useForm({
    resolver: yupResolver(admissionSchema),
    defaultValues: {
      student_id: '',
      course_id: '',
      admission_date: new Date(),
      total_fee: '',
      amount_paid: '0',
      status: 1,
    },
  });

  const { reset, watch, setValue } = methods;
  const watchCourseId = watch('course_id');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (watchCourseId) {
      const course = courses.find(c => c.id === parseInt(watchCourseId));
      if (course) {
        setSelectedCourse(course);
        setValue('total_fee', course.total_fee);
      }
    }
  }, [watchCourseId, courses]);

  const loadInitialData = async () => {
    setLoadingOptions(true);
    setInitialLoading(true);
    try {
      // Load students and courses
      const [studentsResponse, coursesResponse] = await Promise.all([
        studentService.getAll({ per_page: 1000 }),
        courseService.getAll({ per_page: 1000 }),
      ]);

      if (studentsResponse.success) {
        setStudents(studentsResponse.data || []);
      }
      if (coursesResponse.success) {
        setCourses(coursesResponse.data || []);
      }

      // If editing, load admission data
      if (edit && id) {
        await loadAdmissionData();
      } else {
        // For create, check if student or course ID is passed in URL
        const studentId = searchParams.get('student');
        const courseId = searchParams.get('course');
        if (studentId) {
          setValue('student_id', parseInt(studentId));
        }
        if (courseId) {
          setValue('course_id', parseInt(courseId));
          const course = coursesResponse.data?.find(c => c.id === parseInt(courseId));
          if (course) {
            setSelectedCourse(course);
            setValue('total_fee', course.total_fee);
          }
        }
        setInitialLoading(false);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
      toast.error('Failed to load form data');
      setInitialLoading(false);
    } finally {
      setLoadingOptions(false);
    }
  };

  const loadAdmissionData = async () => {
    try {
      const response = await admissionService.getById(parseInt(id));
      
      if (response.success && response.data) {
        const admission = response.data;
        
        // Format date - handle both string and date objects
        let formattedDate = null;
        if (admission.admission_date) {
          try {
            formattedDate = new Date(admission.admission_date);
            // Check if date is valid
            if (isNaN(formattedDate.getTime())) {
              console.warn('Invalid date format:', admission.admission_date);
              formattedDate = new Date(); // Fallback to today
            }
          } catch (e) {
            console.warn('Error parsing date:', e);
            formattedDate = new Date();
          }
        } else {
          formattedDate = new Date();
        }

        // Find the course for this admission
        const course = courses.find(c => c.id === admission.course_id);
        if (course) {
          setSelectedCourse(course);
        }

        // Reset form with admission data
        reset({
          student_id: admission.student_id || '',
          course_id: admission.course_id || '',
          admission_date: formattedDate,
          total_fee: admission.total_fee || '',
          amount_paid: admission.amount_paid || '0',
          status: admission.status !== undefined ? admission.status : 1,
        });

        console.log('Admission data loaded successfully:', admission);
        setInitialLoading(false);
      } else {
        setError('Admission not found');
        toast.error('Admission not found');
        setInitialLoading(false);
      }
    } catch (err) {
      console.error('Failed to load admission:', err);
      setError('Failed to load admission data');
      toast.error('Failed to load admission data');
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      // Format data before submission
      let admissionDate = data.admission_date;
      if (admissionDate instanceof Date) {
        admissionDate = admissionDate.toISOString().split('T')[0];
      }

      const formData = {
        student_id: parseInt(data.student_id),
        course_id: parseInt(data.course_id),
        admission_date: admissionDate,
        total_fee: parseFloat(data.total_fee),
        amount_paid: parseFloat(data.amount_paid) || 0,
        status: parseInt(data.status) || 1,
      };

      console.log('Submitting form data:', formData);

      let result;
      if (edit) {
        result = await admissionService.update(parseInt(id), formData);
      } else {
        result = await admissionService.create(formData);
      }

      if (result.success) {
        toast.success(edit ? 'Admission updated successfully!' : 'Admission created successfully!');
        navigate('/admissions');
      } else {
        setError(result.message || 'Failed to save admission');
        toast.error(result.message || 'Failed to save admission');
      }
    } catch (err) {
      console.error('Submit error:', err);
      
      // Handle validation errors from server
      if (err.response?.data?.errors) {
        const serverErrors = err.response.data.errors;
        const errorMessages = Object.values(serverErrors).flat();
        setError(errorMessages.join(', '));
        toast.error(errorMessages.join(', '));
      } else {
        setError(err.response?.data?.message || 'An error occurred while saving');
        toast.error(err.response?.data?.message || 'Failed to save admission');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admissions');
  };

  // Show loading state
  if (initialLoading || loadingOptions) {
    return <LoadingSpinner fullPage message={initialLoading ? "Loading admission data..." : "Loading options..."} />;
  }

  // Show error state for edit
  if (error && edit) {
    return (
      <div className="container-fluid py-4">
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-1 d-block mb-3"></i>
            <h4 className="text-danger">Error Loading Admission</h4>
            <p className="text-muted">{error}</p>
            <button 
              className="btn btn-primary me-2"
              onClick={() => {
                setError(null);
                setInitialLoading(true);
                loadAdmissionData();
              }}
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

  const studentOptions = students.map(s => ({
    value: s.id,
    label: `${s.full_name} (${s.email})`,
  }));

  const courseOptions = courses.map(c => ({
    value: c.id,
    label: `${c.course_name} - $${Number(c.total_fee)?.toFixed(2) || '0.00'}`,
  }));

  const statusOptions = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{edit ? 'Edit Admission' : 'New Admission'}</h4>
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
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <FormSelect
                    name="student_id"
                    label="Student"
                    options={studentOptions}
                    placeholder="Select student"
                    required
                    disabled={edit}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <FormSelect
                    name="course_id"
                    label="Course"
                    options={courseOptions}
                    placeholder="Select course"
                    required
                    disabled={edit}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <FormDatePicker
                    name="admission_date"
                    label="Admission Date"
                    placeholderText="Select admission date"
                    required
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
                    readOnly={!!selectedCourse}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <FormInput
                    name="amount_paid"
                    label="Amount Paid ($)"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount paid"
                    required
                    min="0"
                  />
                </div>
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

              {selectedCourse && (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Course Details:</strong>
                  <span className="ms-2">
                    {selectedCourse.course_name} | 
                    Fee: <strong>${Number(selectedCourse.total_fee)?.toFixed(2)}</strong>
                    {selectedCourse.duration && ` | Duration: ${selectedCourse.duration} months`}
                  </span>
                </div>
              )}

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
                      {edit ? 'Update Admission' : 'Create Admission'}
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

export default AdmissionForm;