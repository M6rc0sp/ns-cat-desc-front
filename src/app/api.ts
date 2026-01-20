import { axios } from './index';

export const descriptionAPI = {
    getAll: (page = 1, perPage = 15) =>
        axios.get('/descriptions', { params: { page, per_page: perPage } }),

    getCategories: () =>
        axios.get('/descriptions/categories'),

    getByCategory: (categoryId: string) =>
        axios.get(`/descriptions/category/${categoryId}`),

    getById: (id: string) =>
        axios.get(`/descriptions/${id}`),

    create: (data: { category_id: string; content: string; html_content: string }) =>
        axios.post('/descriptions', data),

    update: (id: string, data: { content: string; html_content: string }) =>
        axios.put(`/descriptions/${id}`, data),

    delete: (id: string) =>
        axios.delete(`/descriptions/${id}`),
};
