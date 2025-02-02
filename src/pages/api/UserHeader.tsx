import { LogOut } from 'lucide-react';

interface UserHeaderProps {
  firstName: string;
  onLogout: () => void;
}

export function UserHeader({ firstName, onLogout }: UserHeaderProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-sm">
      <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
        Hola, {firstName}
      </h2>
      <button
        onClick={onLogout}
        className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar sesión
      </button>
    </div>
  );
}