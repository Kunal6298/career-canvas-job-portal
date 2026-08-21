import api from './api.js';

export const getProfile = async () => (await api.get('/users/me')).data;
export const updateProfile = async (profile) => (await api.patch('/users/me', profile)).data;
