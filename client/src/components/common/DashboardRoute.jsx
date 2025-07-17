import { useAuth } from '../../context/AuthContext';

//get dashboard url based on user role
const DashboardRoute = () => {
  const { user } = useAuth();
  let dashboardRoute;
  if (user) {
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
  } else {
    dashboardRoute = '/signin';
  }

  return dashboardRoute;
};

export default DashboardRoute;