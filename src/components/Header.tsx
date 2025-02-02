import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Fluent Phrases" className="h-8 w-auto" />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-700">{user?.email}</span>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};