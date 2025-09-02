import api from './api';

export const adminDashboardAPI = {
  getDashboardOverview: async () => {
    try {
      const response = await api.get('/admin/dashboard/overview');
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      return { success: false, error: error.response?.data?.message || 'An unexpected error occurred' };
    }
  }
};