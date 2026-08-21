import api from './api.js';

export const getJobs = async (params = {}) => (await api.get('/jobs', { params })).data;
export const getJob = async (id) => (await api.get(`/jobs/${id}`)).data;
export const createJob = async (job) => (await api.post('/jobs', job)).data;
export const getRecommendedJobs = async () => (await api.get('/jobs/recommended')).data;
export const getMyJobs = async () => (await api.get('/jobs/mine')).data;
export const updateJob = async (id, job) => (await api.patch(`/jobs/${id}`, job)).data;
