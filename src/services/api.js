import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// automatically attach token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// Auth

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getProfile = () => API.get('./auth/profile');


// Tickets

export const createTicket = (data) => API.post('/tickets', data);
export const getMyTickets = () => API.get('/tickets/my-tickets');
export const getTicketById = (id) => API.get(`/tickets/${id}`);
export const addMessage = (id, data) => API.post(`/tickets/${id}/messages`, data);


// Admin 

export const getAllTickets = (status) => API.get(`/admin/tickets${status ? `?status=${status}` : ''}`);
export const updateTicketStatus = (id, status) => API.put(`/admin/tickets/${id}/status`, { status });
export const adminReply = (id, content) => API.post(`/admin/tickets/${id}/reply`, { content });
export const getStats = () => API.get('/admin/stats');
