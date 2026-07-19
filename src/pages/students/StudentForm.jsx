import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import studentService from '../../api/studentService';
import { useStudents } from '../../hooks/useStudents';
import FormInput from '../../components/forms/FormInput';
import FormSelect from '../../components/forms/FormSelect';
import FormDatePicker from '../../components/forms/FormDatePicker';
import FormTextArea from '../../components/forms/FormTextArea';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const studentSchema = yup.object().shape({
  full_name: yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name is too long'),
  email: yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .max(255, 'Email is too long'),
  mobile: yup.string()
    .required('Mobile number is required')
    .matches(/^[0-9+\-\s]+$/, 'Invalid mobile number format')
    .max(20, 'Mobile number is too long'),
  date_of_birth: yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .min(new Date('1900-01-01'), 'Invalid date of birth'),
  gender: yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Invalid gender selection'),
  address: yup.string()
    .required('Address is required')
    .max(500, 'Address is too long'),
  status: yup.number()
    .default(1)
    .oneOf([0, 1], 'Invalid status'),
});

const StudentForm = ({ edit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { createStudent, updateStudent } = useStudents();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(edit);
  const [error, setError] = useState(null);

  const methods = useForm({
    resolver: yupResolver(studentSchema),
    defaultValues: {
      full_name: '',
      email: '',
      mobile: '',
      date_of_birth: null,
      gender: '',
      address: '',
      status: 1,
    },
  });

  const { reset, setValue } = methods;

  useEffect(() => {
    if (edit && id) {
      loadStudentData();
    } else {
      setInitialLoading(false);
    }
  }, [edit, id]);

  const loadStudentData = async () => {
    setInitialLoading(true);
    setError(null);
    try {
      // Use studentService.getById directly instead of fetchStudents
      const response = await studentService.getById(parseInt(id));
      
      if (response.success && response.data) {
        const student = response.data;
        
        // Format date for the date picker
        let formattedDate = null;
        if (student.date_of_birth) {
          try {
            formattedDate = new Date(student.date_of_birth);
            // Check if date is valid
            if (isNaN(formattedDate.getTime())) {
              formattedDate = null;
            }
          } catch (e) {
            console.warn('Invalid date format:', student.date_of_birth);
            formattedDate = null;
          }
        }

        // Reset form with student data
        reset({
          full_name: student.full_name || '',
          email: student.email || '',
          mobile: student.mobile || '',
          date_of_birth: formattedDate,
          gender: student.gender || '',
          address: student.address || '',
          status: student.status !== undefined ? student.status : 1,
        });

        console.log('Student data loaded successfully:', student);
      } else {
        setError('Student not found');
        toast.error('Student not found');
      }
    } catch (err) {
      console.error('Failed to load student:', err);
      setError('Failed to load student data');
      toast.error('Failed to load student data');
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
        // Ensure date is in YYYY-MM-DD format
        date_of_birth: data.date_of_birth instanceof Date 
          ? data.date_of_birth.toISOString().split('T')[0]
          : data.date_of_birth,
        status: parseInt(data.status) || 1,
      };

      let result;
      if (edit) {
        result = await updateStudent(parseInt(id), formData);
      } else {
        result = await createStudent(formData);
      }

      if (result.success) {
        toast.success(edit ? 'Student updated successfully!' : 'Student created successfully!');
        navigate('/students');
      } else {
        setError(result.message || 'Failed to save student');
        toast.error(result.message || 'Failed to save student');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('An error occurred while saving');
      toast.error('Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/students');
  };

  if (initialLoading) {
    return <LoadingSpinner fullPage message="Loading student data..." />;
  }

  if (error && edit) {
    return (
      <div className="container-fluid py-4">
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-1 d-block mb-3"></i>
            <h4 className="text-danger">Error Loading Student</h4>
            <p className="text-muted">{error}</p>
            <button 
              className="btn btn-primary me-2"
              onClick={loadStudentData}
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

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const statusOptions = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];

  const { formState: { errors } } = methods;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>{edit ? 'Edit Student' : 'Create New Student'}</h4>
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
                <div className="col-md-6">
                  <FormInput
                    name="full_name"
                    label="Full Name"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <FormInput
                    name="mobile"
                    label="Mobile Number"
                    placeholder="Enter mobile number"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <FormDatePicker
                    name="date_of_birth"
                    label="Date of Birth"
                    placeholderText="Select date of birth"
                    required
                    maxDate={new Date()}
                    minDate={new Date('1900-01-01')}
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <FormSelect
                    name="gender"
                    label="Gender"
                    options={genderOptions}
                    placeholder="Select gender"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <FormSelect
                    name="status"
                    label="Status"
                    options={statusOptions}
                    placeholder="Select status"
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <FormTextArea
                    name="address"
                    label="Address"
                    placeholder="Enter full address"
                    required
                    rows={3}
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
                      {edit ? 'Update Student' : 'Create Student'}
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

export default StudentForm;