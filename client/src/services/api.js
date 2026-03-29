import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Generic error handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export const getInvoices = async () => {
    const response = await api.get('/invoices');
    return response.data;
};

export const getLatestInvoiceContext = async () => {
    const response = await api.get('/invoices/latest');
    return response.data;
};

export const getTodayGoldRate = async () => {
    const response = await api.get('/goldrate/today');
    return response.data;
};

export const saveTodayGoldRate = async (goldRate) => {
    const response = await api.post('/goldrate', { goldRate });
    return response.data;
};

export const getInvoiceById = async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
};

export const createInvoice = async (invoiceData) => {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
};

export const deleteInvoice = async (id) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
};

export default api;
