// adminJobAPI.js
import api from './api';

export const adminJobAPI = {
    getAllJobPosts: (page = 1, limit = 10, status = '') => {
        console.log('adminJobAPI: getAllJobPosts called.'); // Keep this log
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', limit);
        if (status) {
            params.append('status', status);
        }
        const requestUrl = `/admin/jobs?${params.toString()}`;
        console.log('adminJobAPI: Making GET request to:', requestUrl); // Keep this log
        return api.get(requestUrl);
    },
    getJobPostById: (id) => api.get(`/admin/jobs/${id}`),
    approveJobPost: (id) => api.patch(`/admin/jobs/${id}/approve`),
    deleteJobPost: (id) => api.delete(`/admin/jobs/${id}`),
};