import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authenticated, redirect to appropriate dashboard
  if (isAuthenticated && user) {
    const dashboardRoute = user.role === 'Job Seeker' ? '/jobseeker/dashboard' : '/employer/dashboard';
    return <Navigate to={dashboardRoute} replace />;
  }

  return children;
};

export default PublicRoute;