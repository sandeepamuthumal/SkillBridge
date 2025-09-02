import api from './api';

export const jobCategoryAPI = {
    getAllCategories: async () => {
        try {
            const response = await api.get('/job-categories');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('Error fetching job categories:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'An unexpected error occurred'
            };
        }
    }
};