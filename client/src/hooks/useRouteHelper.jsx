// hooks/useRouteHelper.js
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useRouteHelper = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getDashboardRoute = () => {
    if (!isAuthenticated || !user) return '/';

    let dashboardRoute;
    if (user.role === 'Job Seeker') {
      dashboardRoute = '/jobseeker/dashboard';
    } else if (user.role === 'Employer') {
      dashboardRoute = '/employer/dashboard';
    }
    else if (user.role === 'Admin') {
      dashboardRoute = '/admin/dashboard';
    }
    else {
      dashboardRoute = '/unauthorized';
    }
    return dashboardRoute;
  };

  const getProfileRoute = () => {
    if (!isAuthenticated || !user) return '/';

    let profileRoute;
    if (user.role === 'Job Seeker') {
      profileRoute = '/jobseeker/profile';
    } else if (user.role === 'Employer') {
      profileRoute = '/employer/profile';
    }
    else if (user.role === 'Admin') {
      profileRoute = '/admin/profile';
    }
    else {
      profileRoute = '/unauthorized';
    }   
    
    return profileRoute;
  };

  const navigateToDashboard = () => {
    navigate(getDashboardRoute());
  };

  const navigateDashboard = (role) => {
    if (role === 'Job Seeker') {
      navigate('/jobseeker/dashboard');
    } else if (role === 'Employer') {
      navigate('/employer/dashboard');
    }
    else if (role === 'Admin') {
      navigate('/admin/dashboard');
    }
    else {
      navigate('/');
    }
  };

  const navigateToProfile = () => {
    navigate(getProfileRoute());
  };

  const navigateBasedOnRole = () => {
    if (!isAuthenticated) {
      navigate('/auth/signin');
      return;
    }
    navigateToDashboard();
  };

  const getMenuItems = () => {
    if (!isAuthenticated || !user) return [];

    const commonItems = [
      { path: '/messages', label: 'Messages', icon: 'MessageCircle' },
      { path: '/notifications', label: 'Notifications', icon: 'Bell' },
      { path: '/settings', label: 'Settings', icon: 'Settings' },
    ];

    if (user.role === 'jobseeker') {
      return [
        { path: '/jobseeker/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
        { path: '/jobseeker/profile', label: 'Profile', icon: 'User' },
        { path: '/jobseeker/applications', label: 'Applications', icon: 'FileText' },
        { path: '/jobseeker/saved-jobs', label: 'Saved Jobs', icon: 'Bookmark' },
        ...commonItems,
      ];
    } else {
      return [
        { path: '/employer/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
        { path: '/employer/profile', label: 'Profile', icon: 'User' },
        { path: '/employer/post-job', label: 'Post Job', icon: 'Plus' },
        { path: '/employer/manage-jobs', label: 'Manage Jobs', icon: 'Briefcase' },
        { path: '/employer/applications', label: 'Applications', icon: 'FileText' },
        ...commonItems,
      ];
    }
  };

  return {
    getDashboardRoute,
    getProfileRoute,
    navigateToDashboard,
    navigateToProfile,
    navigateBasedOnRole,
    getMenuItems,
    navigateDashboard
  };
};