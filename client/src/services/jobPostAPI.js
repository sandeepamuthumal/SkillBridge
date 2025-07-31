import api from './api';

export const jobPostAPI = {



    getAllJobs: async() => {
        try {
            const response = await api.get('/jobs');
            return {
                success: true,
                data: response.data.data
            }
        } catch (error) {
            console.error('Error fetching all jobs:', error);
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },
    getJobById: async(jobId) => {
        try {
            const response = await api.get(`/jobs/${jobId}`);
            return {
                success: true,
                data: response.data.data
            }
        } catch (error) {
            console.error(`Error fetching job with ID ${jobId}:`, error);
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },

    saveJobPost: async(jobId) => {
        try {
            const response = await api.post(`/jobs/save/${jobId}`);
            return {
                success: true,
                message: response.data.message
            }
        } catch (error) {
            console.error(`Error saving job with ID ${jobId}:`, error);
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },

    unsaveJobPost: async(jobId) => {
        try {
            const response = await api.delete(`/jobs/save/${jobId}`);
            return {
                success: true,
                message: response.data.message
            }
        } catch (error) {
            console.error(`Error unsaving job with ID ${jobId}:`, error);
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },

    getSavedJobs: async() => {
        try {
            const response = await api.get('/jobs/saved');
            return {
                success: true,
                data: response.data.data
            }
        } catch (error) {
            console.error('Error fetching saved jobs:', error);
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },

    getRecommendedJobs: async() => {
        try {
            const response = await api.get('/jobseeker/jobs/recommended');
            return {
                success: true,
                data: response.data.data
            }
        } catch (error) {
            console.error('Error fetching recommended jobs:', error);
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },
    createJobPost: async(jobPost) => {
        try {
            const response = await api.post('/jobpost', jobPost);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            }
        } catch (error) {
            console.error('Error creating job post:', error.response.data.message);
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },
};