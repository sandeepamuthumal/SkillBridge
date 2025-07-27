import api from '../api';

export const seekerProfileAPI = {
    // Profile endpoints
    getProfile: async() => {
        try {
            const response = await api.get('/jobseeker/profile');
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

    updateProfile: async(data) => {
        try {
            const response = await api.put('/jobseeker/profile', data);
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

    // Upload profile image
    uploadProfileImage: async(formData) => {
        try {
            const response = await api.post('/jobseeker/profile/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return {
                success: true,
                data: response.data.data,
                imageUrl: response.data.data.profilePictureUrl
            };
        } catch (error) {
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred while uploading image'
            };
        }
    },

    getCities: async() => {
        try {
            const response = await api.get('/cities');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred while fetching cities',
                data: [] // Return empty array as fallback
            };
        }
    },

    // Validate social media URLs
    validateSocialUrl: (url, platform) => {
        if (!url) return true; // Optional field

        const patterns = {
            linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
            github: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/,
            portfolio: /^https?:\/\/.+\..+/
        };

        return patterns[platform] ? patterns[platform].test(url) : false;
    },

    //get job categories
    getJobCategories: async() => {
        try {
            const response = await api.get('/job-categories');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred while fetching job categories',
                data: [] // Return empty array as fallback
            };
        }
    },

    //get job types
    getJobTypes: async() => {
        try {
            const response = await api.get('/job-types');
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response ? error.response.data.message : 'An unexpected error occurred while fetching job types',
                data: [] // Return empty array as fallback
            };
        }
    }
};