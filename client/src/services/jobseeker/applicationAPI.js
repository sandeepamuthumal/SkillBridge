import api from '../api';

export const applicationAPI = {
    submitJobApplication: async(formData) => {
        try {
            const response = await api.post('/jobseeker/apply/job', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },

    getSeekerJobApplications: async() => {
        try {
            const response = await api.get('/jobseeker/job/applications');
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

    deleteApplication: async(applicationId) => {
        try {
            const response = await api.delete(`/jobseeker/job/applications/${applicationId}`);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    }
};