import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const proposalAPI = {
  getAll: () => api.get('/proposals'),
  getById: (id) => api.get(`/proposals/${id}`),
  create: (data) => api.post('/proposals', data),
  update: (id, data) => api.put(`/proposals/${id}`, data),
  delete: (id) => api.delete(`/proposals/${id}`),
};

export const aiAPI = {
  generateProposal: (proposalId) => api.post('/ai/generate-proposal', { proposal_id: proposalId }),
  generatePricing: (proposalId) => api.post('/ai/generate-pricing', { proposal_id: proposalId }),
  generateTimeline: (proposalId) => api.post('/ai/generate-timeline', { proposal_id: proposalId }),
  regenerateSection: (proposalId, sectionName, currentContent) =>
    api.post('/ai/regenerate-section', {
      proposal_id: proposalId,
      section_name: sectionName,
      current_content: currentContent,
    }),
};

export const exportAPI = {
  exportPDF: (proposalId) =>
    api.post('/export/pdf', { proposal_id: proposalId }, { responseType: 'blob' }),
};

export default api;
