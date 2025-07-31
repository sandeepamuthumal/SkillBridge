import axios from 'axios';

const serverUrl =
    import.meta.env.VITE_SERVER_URL;

const API_BASE_URL = serverUrl + '/api';


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Automatically attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto logout on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response ? error.response.status === 401 : false) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);


export const getAllCompanies = async() => {
    const response = await api.get('/employers');
    return response.data;
};

export const fetchJobs = async(filters) => {
    const query = new URLSearchParams(filters).toString();
    const response = await axios.get(`/api/jobs?${query}`);
    return response.data;
};


export default api;