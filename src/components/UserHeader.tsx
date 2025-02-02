// src/components/UserHeader.tsx
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-end gap-4 mb-8">
      {user ? (
        <>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {user.firstName} ({user.role})
          </span>
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </button>
        </>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/signin')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
          >
            Registrarse
          </button>
        </div>
      )}
    </div>
  );
};