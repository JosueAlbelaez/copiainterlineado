import React from 'react';
import { X } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          ¡Mejora a Premium!
        </h2>

        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
              Plan Premium
            </h3>
            <ul className="space-y-2 text-green-600 dark:text-green-400">
              <li>✓ Acceso a todas las categorías</li>
              <li>✓ Sin límite diario de frases</li>
              <li>✓ Contenido exclusivo</li>
              <li>✓ Soporte prioritario</li>
            </ul>
            <div className="mt-4">
              <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                $9.99
              </span>
              <span className="text-green-600 dark:text-green-400">/mes</span>
            </div>
          </div>

          <button
            onClick={() => {
              // Implementar lógica de pago
              console.log('Iniciar proceso de pago');
            }}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Comenzar ahora
          </button>

          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Cancela en cualquier momento. Sin compromiso.
          </p>
        </div>
      </div>
    </div>
  );
};