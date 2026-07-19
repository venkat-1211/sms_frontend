import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import authService from '../../api/authService';
import FormInput from '../../components/forms/FormInput';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const profileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  avatar: yup.string().optional(),
  bio: yup.string().optional(),
});

const passwordSchema = yup.object().shape({
  current_password: yup.string().required('Current password is required'),
  new_password: yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character'),
  new_password_confirmation: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('new_password')], 'Passwords do not match'),
});

const ProfilePage = () => {
  const { user, loadUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const profileMethods = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
      bio: user?.bio || '',
    },
  });

  const passwordMethods = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  useEffect(() => {
    if (user) {
      profileMethods.reset({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const onProfileSubmit = async (data) => {
    setUpdating(true);
    setMessage('');
    setError('');
    try {
      const response = await authService.updateProfile(data);
      if (response.success) {
        setMessage('Profile updated successfully!');
        await loadUser();
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setChangingPassword(true);
    setMessage('');
    setError('');
    try {
      const response = await authService.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
      });
      if (response.success) {
        setMessage('Password changed successfully!');
        passwordMethods.reset({
          current_password: '',
          new_password: '',
          new_password_confirmation: '',
        });
      } else {
        setError(response.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="container-fluid py-4">
      <h4 className="mb-4">Profile Settings</h4>

      {message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      <div className="row">
        {/* Profile Information */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Profile Information</h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="rounded-circle"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white mx-auto"
                    style={{ width: '120px', height: '120px', fontSize: '48px' }}
                  >
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <h5 className="mt-3">{user.name}</h5>
                <p className="text-muted">{user.email}</p>
                {user.provider && (
                  <span className="badge bg-info">
                    <i className="bi bi-google me-1"></i>
                    Google Account
                  </span>
                )}
              </div>

              <FormProvider {...profileMethods}>
                <form onSubmit={profileMethods.handleSubmit(onProfileSubmit)}>
                  <FormInput
                    name="name"
                    label="Full Name"
                    placeholder="Enter your name"
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
                    name="bio"
                    label="Bio"
                    type="textarea"
                    placeholder="Tell us about yourself"
                    rows="3"
                  />

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={updating}
                  >
                    {updating ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : null}
                    Update Profile
                  </button>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Change Password</h5>
            </div>
            <div className="card-body">
              <FormProvider {...passwordMethods}>
                <form onSubmit={passwordMethods.handleSubmit(onPasswordSubmit)}>
                  <FormInput
                    name="current_password"
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                    required
                  />

                  <FormInput
                    name="new_password"
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    required
                  />

                  <FormInput
                    name="new_password_confirmation"
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm new password"
                    required
                  />

                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                  </div>

                  <button
                    type="submit"
                    className="btn btn-warning w-100"
                    disabled={changingPassword}
                  >
                    {changingPassword ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : null}
                    Change Password
                  </button>
                </form>
              </FormProvider>
            </div>
          </div>

          {/* Account Actions */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Account Actions</h5>
            </div>
            <div className="card-body">
              <button
                className="btn btn-outline-danger w-100 mb-2"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to revoke all tokens?')) {
                    try {
                      await authService.revokeAllTokens();
                      alert('All tokens revoked successfully');
                    } catch (err) {
                      alert('Failed to revoke tokens');
                    }
                  }
                }}
              >
                <i className="bi bi-key me-2"></i>
                Revoke All Tokens
              </button>
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => window.location.reload()}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;