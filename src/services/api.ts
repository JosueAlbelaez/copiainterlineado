import axios from 'axios';

// Get base URLs from environment variables
const AUTH_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

// Instance for authentication (auth, user management, payments)
export const authAPI = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Configure interceptors
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authAPI.interceptors.response.use(
  response => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} success:`, response.data);
    return response;
  },
  error => {
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} error:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await authAPI.post('/api/auth/signin', credentials);
  return response.data;
};

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await authAPI.post('/api/auth/signup', userData);
  return response.data;
};

export const verifyToken = async () => {
  const response = await authAPI.get('/api/auth/me');
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await authAPI.post('/api/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await authAPI.post('/api/auth/reset-password', { token, password });
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await authAPI.post('/api/auth/verify-email', { token });
  return response.data;
};

// Payment endpoints
export const createPreference = async (data: { plan: string }) => {
  const response = await authAPI.post('/api/payments/create-preference', data);
  return response.data;
};

export const verifySubscription = async () => {
  const response = await authAPI.get('/api/payments/verify-subscription');
  return response.data;
};

// User endpoints
export const updateUserProfile = async (data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) => {
  const response = await authAPI.put('/api/auth/profile', data);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await authAPI.get('/api/auth/profile');
  return response.data;
};

// Get base URLs from environment variables
const CONTENT_BASE_URL = import.meta.env.VITE_API_URL || 'https://interlineado-backend-fluent-phrases.vercel.app';

// Instance for content (readings, phrases)
export const contentAPI = axios.create({
  baseURL: CONTENT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// For backward compatibility
export const API = contentAPI;

[contentAPI].forEach(instance => {
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

// Reading endpoints (using contentAPI)
export const getReadings = async () => {
  const response = await contentAPI.get('/api/readings');
  return response.data;
};

export const getReadingById = async (id: string) => {
  const response = await contentAPI.get(`/api/readings/${id}`);
  return response.data;
};

// Phrases endpoints (using contentAPI)
export const getPhrases = async (language: string, category?: string) => {
  const response = await contentAPI.get('/api/phrases', {
    params: { language, category }
  });
  return response.data;
};

export const incrementPhraseCount = async () => {
  const response = await contentAPI.post('/api/phrases/increment');
  return response.data;
};