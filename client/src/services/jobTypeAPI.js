import api from './api';

export const jobTypeAPI = {
    getAllJobTypes: async () => {
        try {
            const response = await api.get('/job-types');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('Error fetching job types:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'An unexpected error occurred'
            };
        }
    }
};