import api from './api';

export const feedbackAPI = {
    getFeedbacks: async() => {
        try {
            const response = await api.get('/jobseeker/feedbacks');
            return {
                success: true,
                data: response.data.data
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },
    getFeedbackById: async(feedbackId) => {
        try {
            const response = await api.get(`/jobseeker/feedbacks/${feedbackId}`);
            return {
                success: true,
                data: response.data.data
            }
        } catch (error) {
            console.error(`Error fetching feedback with ID ${feedbackId}:`, error);
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },
    createFeedback: async(feedbackData) => {
        try {
            const response = await api.post('/employer/candidate-feedback', feedbackData);
            return {
                success: true,
                data: response.data.data,
                message: response.data.message
            }
        } catch (error) {
            console.error('Error creating feedback:', error.response.data.message);
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },
};