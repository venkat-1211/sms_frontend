import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import FormInput from '../../components/forms/FormInput';

const registerSchema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character'),
  password_confirmation: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const methods = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const result = await registerUser(data);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 py-4">
      <div className="card shadow-lg p-4" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="text-center mb-4">
          <i className="bi bi-mortarboard-fill text-primary fs-1"></i>
          <h4 className="mt-2">Create Account</h4>
          <p className="text-muted">Register to get started</p>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormInput
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
              required
            />

            <FormInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              required
            />

            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="Create a password"
              required
            />

            <FormInput
              name="password_confirmation"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : null}
              Register
            </button>
          </form>
        </FormProvider>

        <div className="text-center mt-3">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;