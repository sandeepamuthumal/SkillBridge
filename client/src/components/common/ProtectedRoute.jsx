import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    toast.error('You must be signed in to access this page.');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check for specific role requirement
  if (requiredRole && user?.role !== requiredRole) {
    toast.error(`Access denied: You need ${requiredRole} role to view this page.`);
    console.warn(`Access denied: User role ${user?.role} does not match required role ${requiredRole}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for allowed roles (multiple roles)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    toast.error(`Access denied: You do not have permission to view this page.`);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;