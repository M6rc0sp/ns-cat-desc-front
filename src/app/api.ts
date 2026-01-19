import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const descriptionAPI = {
    getAll: (page = 1, perPage = 15) =>
        api.get('/descriptions', { params: { page, per_page: perPage } }),

    getCategories: () =>
        api.get('/descriptions/categories'),

    getByCategory: (categoryId: string) =>
        api.get(`/descriptions/category/${categoryId}`),

    getById: (id: string) =>
        api.get(`/descriptions/${id}`),

    create: (data: { category_id: string; content: string; html_content: string }) =>
        api.post('/descriptions', data),

    update: (id: string, data: { content: string; html_content: string }) =>
        api.put(`/descriptions/${id}`, data),

    delete: (id: string) =>
        api.delete(`/descriptions/${id}`),
};
