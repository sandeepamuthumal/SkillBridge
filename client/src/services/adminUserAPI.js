import api from './api';

export const adminUserAPI = {
    getAllAdmins: () => api.get('/admin/users/admins'),
    addAdmin: (adminData) => api.post('/admin/users/admins', adminData),
    updateAdminEmail: (id, data) => api.patch(`/admin/users/admins/${id}/email`, data),
    updateAdminPassword: (id, data) => api.patch(`/admin/users/admins/${id}/password`, data),
    reactivateAdmin: (id) => api.patch(`/admin/users/admins/${id}/reactivate`),
    deactivateAdmin: (id) => api.patch(`/admin/users/admins/${id}/deactivate`),
};