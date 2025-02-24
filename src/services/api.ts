import axios from 'axios';

// Get base URLs from environment variables with better error handling
const AUTH_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';
const CONTENT_BASE_URL = import.meta.env.VITE_API_URL || '';

// Debug logging for environment variables
console.log('Environment Variables:', {
  AUTH_BASE_URL,
  CONTENT_BASE_URL
});

if (!AUTH_BASE_URL) {
  console.error('VITE_BACKEND_URL is not defined');
}

if (!CONTENT_BASE_URL) {
  console.error('VITE_API_URL is not defined');
}

// Instance for authentication (auth, user management, payments)
export const authAPI = axios.create({
  baseURL: '/api',  // Base URL already includes /api
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Important for CORS with credentials
});

// Configure interceptors with detailed request logging
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`, config);
  return config;
});

authAPI.interceptors.response.use(
  response => {
    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} success:`, response.data);
    return response;
  },
  error => {
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} error:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// Auth endpoints - Remove /api prefix since it's already in baseURL
export const loginUser = async (credentials: { email: string; password: string }) => {
  console.log('Attempting login with credentials:', { ...credentials, password: '[REDACTED]' });
  const response = await authAPI.post('/auth/signin', credentials);
  return response.data;
};

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await authAPI.post('/auth/signup', userData);
  return response.data;
};

export const verifyToken = async () => {
  const response = await authAPI.get('/auth/me');
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await authAPI.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await authAPI.post('/auth/reset-password', { token, password });
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await authAPI.post('/auth/verify-email', { token });
  return response.data;
};

// Payment endpoints - Remove /api prefix since it's already in baseURL
export const createPreference = async (data: { plan: string }) => {
  const response = await authAPI.post('/payments/create-preference', data);
  return response.data;
};

export const verifySubscription = async () => {
  const response = await authAPI.get('/payments/verify-subscription');
  return response.data;
};

// User endpoints - Remove /api prefix since it's already in baseURL
export const updateUserProfile = async (data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}) => {
  const response = await authAPI.put('/auth/profile', data);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await authAPI.get('/auth/profile');
  return response.data;
};

// Instance for content (readings, phrases)
export const contentAPI = axios.create({
  baseURL: '/api',  // Base URL already includes /api
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// For backward compatibility
export const API = contentAPI;

[contentAPI].forEach(instance => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`, config);
    return config;
  });

  instance.interceptors.response.use(
    response => {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} success:`, response.data);
      return response;
    },
    error => {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} error:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: error.config
      });
      return Promise.reject(error);
    }
  );
});

// Reading endpoints - Remove /api prefix since it's already in baseURL
export const getReadings = async () => {
  const response = await contentAPI.get('/readings');
  return response.data;
};

export const getReadingById = async (id: string) => {
  const response = await contentAPI.get(`/readings/${id}`);
  return response.data;
};

// Phrases endpoints - Remove /api prefix since it's already in baseURL
export const getPhrases = async (language: string, category?: string) => {
  const response = await contentAPI.get('/phrases', {
    params: { language, category }
  });
  return response.data;
};

export const incrementPhraseCount = async () => {
  const response = await contentAPI.post('/phrases/increment');
  return response.data;
};