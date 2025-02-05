import axios from 'axios';
import { IUser } from '../types/express';

// Instancia para la API principal (deployed backend)
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001'
});

// Instancia para autenticación (local backend)
export const AUTH_API = axios.create({
  baseURL: 'http://localhost:5001/api/auth'  // Siempre usar el backend local para auth
});

// Configurar interceptores para ambas instancias
[API, AUTH_API].forEach(instance => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    response => {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} success:`, response.data);
      return response;
    },
    error => {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} error:`, error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
});

// Auth endpoints
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await AUTH_API.post('/signin', credentials);
  return response.data;
};

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await AUTH_API.post('/signup', userData);
  return response.data;
};

export const verifyToken = async (): Promise<IUser> => {
  const response = await AUTH_API.get('/me');
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await AUTH_API.post('/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await AUTH_API.post('/reset-password', { token, password });
  return response.data;
};

// Reading endpoints
export const getReadings = async () => {
  const response = await API.get('/api/readings');  // Añadido el prefijo /api
  return response.data;
};