import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Request interceptor to attach JWT bearer token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('classflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
};

export const entityAPI = {
  getDepartments: () => API.get('/departments'),
  createDepartment: (data) => API.post('/departments', data),
  getFaculty: () => API.get('/faculty'),
  createFaculty: (data) => API.post('/faculty', data),
  getSubjects: () => API.get('/subjects'),
  createSubject: (data) => API.post('/subjects', data),
  getDivisions: () => API.get('/divisions'),
  createDivision: (data) => API.post('/divisions', data),
  getRooms: () => API.get('/rooms'),
  createRoom: (data) => API.post('/rooms', data),
};

export const timetableAPI = {
  getTimetables: () => API.get('/timetable'),
  getById: (id) => API.get(`/timetable/${id}`),
  generate: (data) => API.post('/timetable/generate', data),
  publish: (id) => API.post(`/timetable/${id}/publish`),
  seedDemo: () => API.post('/seed/seed-demo'),
};

export const aiAPI = {
  chat: (prompt, timetableId) => API.post('/ai/chat', { prompt, timetableId }),
};

export const analyticsAPI = {
  get: () => API.get('/analytics'),
};

export default API;
