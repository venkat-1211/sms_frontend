import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import FormInput from '../../components/forms/FormInput';

const loginSchema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const methods = useForm({
  resolver: yupResolver(loginSchema),
});

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    const result = await login(data);
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const result = await googleLogin(tokenResponse.access_token);
      if (result.success) {
        navigate('/dashboard');
      }
    },
    onError: () => {
      setError('Google login failed');
    },
  });

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <i className="bi bi-mortarboard-fill text-primary fs-1"></i>
          <h4 className="mt-2">Student Management System</h4>
          <p className="text-muted">Sign in to continue</p>
        </div>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onSubmit)}>
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
            placeholder="Enter your password"
            required
          />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to="/forgot-password" className="text-decoration-none small">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : null}
            Sign In
          </button>
        </form>
        </FormProvider>

        <div className="text-center mt-3">
          <span className="text-muted">Don't have an account? </span>
          <Link to="/register">Sign Up</Link>
        </div>

        <hr className="my-3" />

        <button
          className="btn btn-outline-danger w-100"
          onClick={() => handleGoogleLogin()}
        >
          <i className="bi bi-google me-2"></i>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;