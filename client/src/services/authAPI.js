import api from './api';

export const authAPI = {
    // Auth endpoints
    post: (endpoint, data) => api.post(endpoint, data),
    signin: (credentials) => api.post('/auth/signin', credentials),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),

    // Email Verification
    verifyEmail: (params) => api.get(`/auth/verify-email?token=${params.token}&email=${encodeURIComponent(params.email)}`),
    resendVerification: (data) => api.post('/auth/resend-verification', data),

    // Password Reset
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword: (data) => api.post('/auth/reset-password', data)
};