import api from './api';

export const adminReportAPI = {
  getJobAnalytics: async (filters) => {
    const params = new URLSearchParams(filters);
    try {
      const response = await api.get(`/admin/reports/jobs?${params.toString()}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching job analytics:', error);
      return { success: false, error: error.response?.data?.message || 'Server error' };
    }
  },
  exportJobAnalyticsPdf: async (filters) => {
        const params = new URLSearchParams(filters);
        try {
            const response = await api.get(`/admin/reports/jobs/export/pdf?${params.toString()}`, {
                responseType: 'blob', // Important: tells Axios to expect a binary response
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `job_analytics_${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            return { success: true };
        } catch (error) {
            console.error('Error exporting PDF:', error);
            return { success: false, error: 'Failed to export PDF.' };
        }
    }
};