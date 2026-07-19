import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import authService from '../../api/authService';
import FormInput from '../../components/forms/FormInput';

const resetPasswordSchema = yup.object().shape({
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

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      setError('Invalid reset link. Please request a new one.');
    }
  }, [searchParams]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await authService.resetPassword({
        token: token,
        email: email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (error && !token) {
    return (
      <div className="container d-flex align-items-center justify-content-center min-vh-100">
        <div className="card shadow-lg p-4" style={{ maxWidth: '420px', width: '100%' }}>
          <div className="text-center mb-4">
            <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
            <h4 className="mt-2">Invalid Reset Link</h4>
            <p className="text-danger">{error}</p>
            <Link to="/forgot-password" className="btn btn-primary">
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <i className="bi bi-key-fill text-primary fs-1"></i>
          <h4 className="mt-2">Create New Password</h4>
          <p className="text-muted">Enter your new password below</p>
        </div>

        {success && (
          <div className="alert alert-success">
            <i className="bi bi-check-circle-fill me-2"></i>
            Password reset successfully! Redirecting to login...
          </div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {!success && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="text-muted small mb-3">
              Resetting password for: <strong>{email}</strong>
            </p>

            <FormInput
              name="password"
              label="New Password"
              type="password"
              placeholder="Enter new password"
              required
              register={register}
              errors={errors}
            />

            <FormInput
              name="password_confirmation"
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              required
              register={register}
              errors={errors}
            />

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : null}
              Reset Password
            </button>
          </form>
        )}

        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;