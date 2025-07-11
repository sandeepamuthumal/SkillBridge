import api from './api';

export const authAPI = {
    signup: (data) => api.post('/auth/signup', data),
    signin: (data) => api.post('/auth/signin', data),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout')
};