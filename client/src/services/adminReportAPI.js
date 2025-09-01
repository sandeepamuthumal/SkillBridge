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
    },
    getApplicationReport: async (filters) => {
        try {
            const params = new URLSearchParams(filters);
            const response = await api.get(`/admin/reports/applications?${params.toString()}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error fetching application report:', error);
            return { success: false, error: error.response?.data?.message || 'An unexpected error occurred' };
        }
    },

    

    downloadApplicationFile: async (applicationId) => {
        try {
            const response = await api.get(`/admin/reports/applications/${applicationId}/download`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const contentDisposition = response.headers['content-disposition'];
            let filename = `application_${applicationId}.pdf`;

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            return { success: true };
        } catch (error) {
            console.error('Error downloading file:', error);
            return { success: false, error: 'Failed to download application file.' };
        }
    },

     exportApplicationReportPdf: async (filters) => {
        const params = new URLSearchParams(filters);
        try {
            const response = await api.get(`/admin/reports/applications/export/pdf?${params.toString()}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const contentDisposition = response.headers['content-disposition'];
            let filename = `application_report.pdf`;

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch && filenameMatch.length === 2) {
                    filename = filenameMatch[1];
                }
            }
            
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
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