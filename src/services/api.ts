
import axios from 'axios';
import { IUser } from '../types/express';

// Single instance for all API calls
export const API = axios.create({
  baseURL: 'http://localhost:5001/api'
});

// Alias for backward compatibility
export const AUTH_API = API;

// Configure interceptors
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  response => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} success:`, response.data);
    return response;
  },
  error => {
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} error:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

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
  const response = await API.post<LoginResponse>('/auth/signin', credentials);
  return response.data;
};

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  const response = await API.post<RegisterResponse>('/auth/signup', userData);
  return response.data;
};

export const verifyToken = async (): Promise<IUser> => {
  const response = await API.get<IUser>('/auth/me');
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await API.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await API.post('/auth/reset-password', { token, password });
  return response.data;
};

// Reading endpoints
export const getReadings = async () => {
  const response = await API.get('/readings');
  return response.data;
};
