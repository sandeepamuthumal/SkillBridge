import api from './api';

export const authAPI = {
    // Auth endpoints
    post: (endpoint, data) => api.post(endpoint, data),
    signin: (credentials) => api.post('/auth/signin', credentials),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/signout'),

    // Email Verification
    verifyEmail: (params) => api.get(`/auth/verify-email?token=${params.token}&email=${encodeURIComponent(params.email)}`),
    resendVerification: (data) => api.post('/auth/resend-verification', data),

    // Password Reset
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),

    // Admin specific endpoints 
    getAllUsers: (page = 1, limit = 10, role = '', status = '', search = '') => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (role && role !== 'All') params.append('role', role);
        if (status && status !== 'All') params.append('status', status);
        if (search) params.append('search', search);
        return api.get(`/admin/users?${params.toString()}`);
    }, // New endpoint to fetch all users
    updateUserStatus: (userId, data) => api.patch(`/admin/users/${userId}/status`, data), // New endpoint for status update
    adminResetUserPassword: (userId, data) => api.patch(`/admin/users/${userId}/reset-password`, data)
    
};