import api from './api';

export const adminUserAPI = {
    getAllAdmins: (page = 1, limit = 10, status = '', search = '') => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (status && status !== 'All') params.append('status', status);
        if (search) params.append('search', search);
        return api.get(`/admin/users/admins?${params.toString()}`);
    },

    
    getAllJobSeekers: (page = 1, limit = 10, status = '', search = '') => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (status && status !== 'All') params.append('status', status);
        if (search) params.append('search', search);
        return api.get(`/admin/users/seekers?${params.toString()}`);
    },

    
    getAllEmployers: (page = 1, limit = 10, status = '', search = '') => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (status && status !== 'All') params.append('status', status);
        if (search) params.append('search', search);
        return api.get(`/admin/users/employers?${params.toString()}`);
    },
    addAdmin: (adminData) => api.post('/admin/users/admins', adminData),
    updateAdminEmail: (id, data) => api.patch(`/admin/users/admins/${id}/email`, data),
    updateAdminPassword: (id, data) => api.patch(`/admin/users/admins/${id}/password`, data),
    reactivateAdmin: (id) => api.patch(`/admin/users/admins/${id}/reactivate`),
    deactivateAdmin: (id) => api.patch(`/admin/users/admins/${id}/deactivate`),
};