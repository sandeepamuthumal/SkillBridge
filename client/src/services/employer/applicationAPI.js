import api from '../api';

export const applicationAPI = {
    getEmployerJobApplications: async() => {
        try {
            const response = await api.get('/employer/applications');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },

    updateApplicationStatus: async(applicationId, data) => {
        try {
            const response = await api.post(`/employer/application/${applicationId}/status`, data);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    }
};