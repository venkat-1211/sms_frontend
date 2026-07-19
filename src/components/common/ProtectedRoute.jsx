import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { authenticated, loading, permissions } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check permissions if required
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(p => permissions.includes(p));
    if (!hasAllPermissions) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;