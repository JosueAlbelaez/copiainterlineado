import axios from 'axios';

// Create instance for the main API (readings)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

// Create instance for authentication
const AUTH_API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || '/api'
});

// Configure interceptors for both instances
[API, AUTH_API].forEach(instance => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});

// Auth endpoints
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await AUTH_API.post('/auth/signin', credentials);
  return response.data;
};

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await AUTH_API.post('/auth/signup', userData);
  return response.data;
};

export const verifyToken = async () => {
  const response = await AUTH_API.get('/auth/me');
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await AUTH_API.post('/auth/forgot-password', { email });
  return response.data;
};

// Reading endpoints
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