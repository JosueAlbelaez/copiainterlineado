import axios from 'axios';

// Create instance for the backend principal
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'  // Usa la URL de producción o el proxy local como fallback
});

// Configure interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await API.post('/auth/signin', credentials);
  return response.data;
};

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await API.post('/auth/signup', userData);
  return response.data;
};

export const getReadings = async () => {
  console.log('📚 Obteniendo lecturas...');
  try {
    const response = await API.get('/readings');
    console.log('✅ Lecturas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener lecturas:', error);
    throw error;
  }
};

export const verifyToken = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await API.post('/auth/forgot-password', { email });
  return response.data;
};