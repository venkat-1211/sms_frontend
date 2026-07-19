import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

// Lazy load pages
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = React.lazy(() => import('../pages/auth/ResetPasswordPage'));
const DashboardPage = React.lazy(() => import('../pages/dashboard/DashboardPage'));
const StudentPage = React.lazy(() => import('../pages/students/StudentPage'));
const StudentForm = React.lazy(() => import('../pages/students/StudentForm'));
const StudentDetails = React.lazy(() => import('../pages/students/StudentDetails'));
const CoursePage = React.lazy(() => import('../pages/courses/CoursePage'));
const CourseForm = React.lazy(() => import('../pages/courses/CourseForm'));
const CourseDetails = React.lazy(() => import('../pages/courses/CourseDetails'));
const AdmissionPage = React.lazy(() => import('../pages/admissions/AdmissionPage'));
const AdmissionForm = React.lazy(() => import('../pages/admissions/AdmissionForm'));
const AdmissionDetails = React.lazy(() => import('../pages/admissions/AdmissionDetails'));
const ProfilePage = React.lazy(() => import('../pages/profile/ProfilePage'));

const routes = [
  {
    path: '/login',
    element: (
      <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <LoginPage />
      </React.Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <RegisterPage />
      </React.Suspense>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <ForgotPasswordPage />
      </React.Suspense>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
        <ResetPasswordPage />
      </React.Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <DashboardPage />
          </React.Suspense>
        ),
      },
      // Student Routes
      {
        path: 'students',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <StudentPage />
          </React.Suspense>
        ),
      },
      {
        path: 'students/create',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <StudentForm />
          </React.Suspense>
        ),
      },
      {
        path: 'students/:id',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <StudentDetails />
          </React.Suspense>
        ),
      },
      {
        path: 'students/:id/edit',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <StudentForm edit />
          </React.Suspense>
        ),
      },
      // Course Routes
      {
        path: 'courses',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <CoursePage />
          </React.Suspense>
        ),
      },
      {
        path: 'courses/create',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <CourseForm />
          </React.Suspense>
        ),
      },
      {
        path: 'courses/:id',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <CourseDetails />
          </React.Suspense>
        ),
      },
      {
        path: 'courses/:id/edit',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <CourseForm edit />
          </React.Suspense>
        ),
      },
      // Admission Routes
      {
        path: 'admissions',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <AdmissionPage />
          </React.Suspense>
        ),
      },
      {
        path: 'admissions/create',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <AdmissionForm />
          </React.Suspense>
        ),
      },
      {
        path: 'admissions/:id',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <AdmissionDetails />
          </React.Suspense>
        ),
      },
      {
        path: 'admissions/:id/edit',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <AdmissionForm edit />
          </React.Suspense>
        ),
      },
      // Profile
      {
        path: 'profile',
        element: (
          <React.Suspense fallback={<div className="text-center py-5">Loading...</div>}>
            <ProfilePage />
          </React.Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <div className="text-center py-5"><h1>404 - Page Not Found</h1></div>,
  },
];

export default createBrowserRouter(routes);