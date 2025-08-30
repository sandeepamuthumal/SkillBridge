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

    // Admin specific endpoints (NEW)
    getAllUsers: () => api.get('/admin/users'), // New endpoint to fetch all users
    updateUserStatus: (userId, data) => api.patch(`/admin/users/${userId}/status`, data), // New endpoint for status update
    adminResetUserPassword: (userId, data) => api.patch(`/admin/users/${userId}/reset-password`, data)
    
};