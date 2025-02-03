import axios from 'axios';

// Crear instancia para el backend principal (lecturas)
const API = axios.create({
  baseURL: 'http://localhost:5001/api'  // Cambiado de 3000 a 5001 para coincidir con el servidor
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
  const response = await AuthAPI.get('/me');
  return response.data;
};