import axios from 'axios';

// Automatically use localhost in dev, and Render in prod
const API_URL = import.meta.env.DEV 
  ? 'http://localhost:5000' 
  : (import.meta.env.VITE_API_URL || 'https://banking-backend-smqa.onrender.com');

const api = axios.create({
  baseURL: API_URL,
});

// Optional: Add a request interceptor to automatically add the Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle 401 Unauthorized errors (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear storage and reload to trigger logout in store
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
