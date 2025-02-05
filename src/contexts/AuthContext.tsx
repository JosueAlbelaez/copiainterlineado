import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, verifyToken } from '../services/api';
import { IUser } from '../types/express';

type User = Omit<IUser, '_id' | 'dailyPhrasesCount' | 'lastPhrasesReset'> & {
  id: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await verifyToken();
      const transformedUser: User = {
        id: userData._id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role
      };
      setUser(transformedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Iniciando sesión con:', email);
      const data = await loginUser({ email, password });
      
      localStorage.setItem('token', data.token);
      const transformedUser: User = {
        id: data.user._id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role
      };
      setUser(transformedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error de login:', error);
      throw error;
    }
  };

  const register = async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      const data = await registerUser(userData);
      localStorage.setItem('token', data.token);
      const transformedUser: User = {
        id: data.user._id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        role: data.user.role
      };
      setUser(transformedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error de registro:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};