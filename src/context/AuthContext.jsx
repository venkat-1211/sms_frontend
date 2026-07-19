import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/apiClient';
import authService from '../api/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.data);
        setAuthenticated(true);
        setPermissions(response.data.permissions || []);
      }
    } catch (error) {
      localStorage.clear();
      setUser(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success) {
        const { access_token, refresh_token, user } = response.data;
        
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        
        setUser(user);
        setAuthenticated(true);
        toast.success('Login successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success) {
        toast.success('Registration successful! Please login.');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const response = await authService.googleLogin(credential);
      if (response.success) {
        const { access_token, refresh_token, user } = response.data;
        
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        
        setUser(user);
        setAuthenticated(true);
        toast.success('Google login successful!');
        return { success: true };
      }
    } catch (error) {
      toast.error('Google login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.clear();
      setUser(null);
      setAuthenticated(false);
      setPermissions([]);
      toast.info('Logged out successfully');
      window.location.href = '/login';
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      if (response.success) {
        setUser(response.data);
        toast.success('Profile updated successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to update profile');
      return { success: false };
    }
  };

  const changePassword = async (data) => {
    try {
      const response = await authService.changePassword(data);
      if (response.success) {
        toast.success('Password changed successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to change password');
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    authenticated,
    permissions,
    login,
    register,
    logout,
    googleLogin,
    loadUser,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};