import axios from 'axios';

// Instancia para la API de lecturas (deployed backend)
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Instancia para autenticación (local backend)
export const AUTH_API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
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
});

// Auth endpoints usando AUTH_API
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

export const resetPassword = async (token: string, password: string) => {
  const response = await AUTH_API.post('/auth/reset-password', { token, password });
  return response.data;
};

// Reading endpoints usando API
export const getReadings = async () => {
  console.log('📚 Obteniendo lecturas desde:', import.meta.env.VITE_API_URL);
  try {
    const response = await API.get('/readings');
    console.log('✅ Lecturas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener lecturas:', error);
    throw error;
  }
};