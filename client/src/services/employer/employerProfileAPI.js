import api from '../api';

export const employerProfileAPI = {
    // Profile endpoints
    getProfile: async() => {
        try {
            const response = await api.get('/employer/profile');
            return {
                success: true,
                data: response.data.data
            }
        } catch (error) {
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },
    
    // Upload profile image
    uploadLogo: async(formData) => {
        try {
            const response = await api.post('/employer/profile/logo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return {
                success: true,
                data: response.data.data,
                imageUrl: response.data.data.logoUrl
            };
        } catch (error) {
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred while uploading image'
            };
        }
    },

    updateProfile: async(data) => {
        try {
            const response = await api.put('/employer/profile', data);
            return {
                success: true,
                data: response.data.data,
                message: 'Profile updated successfully'
            }
        } catch (error) {
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred'
            };
        }
    },
};