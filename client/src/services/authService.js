import api from './api.js';

export const login = async (credentials) => (await api.post('/auth/login', credentials)).data;
export const register = async (details) => (await api.post('/auth/register', details)).data;
