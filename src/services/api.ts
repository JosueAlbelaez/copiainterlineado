import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post('/api/auth/signin', credentials); // Ruta relativa
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
  return response.data;
};

export const registerUser = (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => API.post('/auth/signup', userData);

export const getProtectedData = () => API.get('/protected-route');