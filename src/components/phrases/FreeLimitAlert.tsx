import { Lock } from 'lucide-react';

// FreeLimitAlert.tsx
interface FreeLimitAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeLimitAlert: React.FC<FreeLimitAlertProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-8 h-8 text-yellow-500" />
          <h2 className="text-xl font-semibold dark:text-white">Límite diario alcanzado</h2>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Has alcanzado tu límite de artículos gratuitos. Actualiza a premium para acceso completo.
          </p>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              Cerrar
            </button>
            <button
              onClick={() => window.location.href = '/pricing'}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Ver planes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};