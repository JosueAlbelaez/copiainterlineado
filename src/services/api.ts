import axios from 'axios';

// Crear instancia para el backend principal (lecturas)
const API = axios.create({
  baseURL: 'https://interlineado-backend-fluent-phrases.vercel.app'
});

// Crear instancia para el servidor de autenticación local
const AuthAPI = axios.create({
  baseURL: '/api/auth'  // Esto usará el proxy configurado en vite.config.ts
});

// Configurar interceptor para ambas instancias
[API, AuthAPI].forEach(instance => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});

export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await AuthAPI.post('/signin', credentials);
  return response.data;
};

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await AuthAPI.post('/signup', userData);
  return response.data;
};

export const getReadings = async () => {
  const response = await API.get('/readings');
  return response.data;
};

export const verifyToken = async () => {
  const response = await AuthAPI.get('/me');
  return response.data;
};