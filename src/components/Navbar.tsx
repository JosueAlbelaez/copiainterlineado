import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { Moon, Sun, Home, LogOut, Menu } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useAuth } from '../contexts/AuthContext';
import logo from '../img/logo.png';

export const Navbar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center justify-start h-20 gap-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="w-16 h-16" />
              <span className="text-xl md:text-2xl lg:text-3xl font-bold text-[#00BF63] dark:text-[#00BF63]">
                Interlineado
              </span>
            </Link>
            <button
              onClick={() => window.location.href = 'https://fluentphrases.org/'}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </button>
          </div>
          
          {/* Botón de menú móvil */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-900 dark:text-white hover:text-gray-600 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Menú desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user && (
              <span className="font-medium text-gray-900 dark:text-white">
                Hola, {user.firstName}
              </span>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-gray-600" />
              )}
            </button>
            {isAuthenticated && (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg p-4 flex flex-col gap-4">
          {isAuthenticated && user && (
            <span className="block font-medium text-gray-900 dark:text-white">
              Hola, {user.firstName}
            </span>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg flex justify-center bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-gray-600" />
            )}
          </button>
          {isAuthenticated && (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
