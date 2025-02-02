import { Moon, Sun, LogOut, Home, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import logo from '../../img/logo.png';
import { useState } from 'react';

interface HeaderProps {
  user?: {
    firstName: string;
  } | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`py-4 transition-colors ${
        isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-blue-500 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop & Mobile */}
        <div className="flex justify-between items-center">
          {/* Logo y botón Inicio */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="w-12 h-12 md:w-16 md:h-16" />
            <button
              onClick={() => window.location.href = '/'}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-blue-400 hover:bg-blue-300'
              } text-white transition-colors`}
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </button>
          </div>

          {/* Icono de menú móvil */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-gray-200 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Menú desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <span className="font-medium">
                Hola, {user.firstName}
              </span>
            )}

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-400'
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </button>

            {user && onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 transition-colors hover:text-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            )}
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMobileMenuOpen && (
          <div className="mt-4 space-y-4 md:hidden">
            <button
              onClick={() => window.location.href = '/'}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800 hover:bg-gray-700'
                  : 'bg-blue-400 hover:bg-blue-300'
              } text-white transition-colors w-full`}
            >
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </button>

            {user && (
              <span className="block font-medium">
                Hola, {user.firstName}
              </span>
            )}

            <button
              onClick={toggleDarkMode}
              className={`w-full p-2 rounded-lg transition-colors flex justify-center ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-blue-400 hover:bg-blue-300'
              }`}
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </button>

            {user && onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:text-red-200 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

