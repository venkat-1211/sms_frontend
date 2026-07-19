import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import authService from '../../api/authService';
import FormInput from '../../components/forms/FormInput';

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email format'),
});

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const response = await authService.forgotPassword(data.email);
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <i className="bi bi-mortarboard-fill text-primary fs-1"></i>
          <h4 className="mt-2">Reset Password</h4>
          <p className="text-muted">Enter your email to receive a reset link</p>
        </div>

        {success && (
          <div className="alert alert-success">
            <i className="bi bi-check-circle-fill me-2"></i>
            Password reset link sent to your email. Please check your inbox.
          </div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {!success && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your registered email"
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
              Send Reset Link
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

export default ForgotPasswordPage;