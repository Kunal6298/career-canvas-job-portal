import api from './api.js';

export const applyToJob = async (formData) =>
  (await api.post('/applications', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data;
export const getMyApplications = async () => (await api.get('/applications/me')).data;
export const getRecruiterApplications = async () => (await api.get('/applications/recruiter')).data;
export const updateApplicationStatus = async (id, status) => (await api.patch(`/applications/${id}/status`, { status })).data;
export const downloadResume = async (id, filename = 'resume') => {
  const response = await api.get(`/applications/${id}/resume`, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
