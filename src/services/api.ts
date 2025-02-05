
import axios from 'axios';
import { IUser } from '../types/express';

// Instancia para la API de lecturas (deployed backend)
export const API = axios.create({
  baseURL: 'http://localhost:5001/api'  // Actualizado para apuntar al puerto 5001 donde corre Express
});

// Instancia para autenticación (local backend)
export const AUTH_API = axios.create({
  baseURL: 'http://localhost:5001/api/auth'  // Actualizado para apuntar al puerto 5001
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

  // Agregar interceptor para logs
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

interface LoginResponse {
  token: string;
  user: IUser;
}

interface RegisterResponse {
  token: string;
  user: IUser;
}

// Auth endpoints
export const loginUser = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
  const response = await AUTH_API.post<LoginResponse>('/signin', credentials);
  return response.data;
};

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  const response = await AUTH_API.post<RegisterResponse>('/signup', userData);
  return response.data;
};

export const verifyToken = async (): Promise<IUser> => {
  const response = await AUTH_API.get<IUser>('/me');
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
  const response = await API.get('/readings');
  return response.data;
};
