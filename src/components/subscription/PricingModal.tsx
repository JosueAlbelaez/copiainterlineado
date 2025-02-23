import React from 'react';
import { X } from 'lucide-react';
import { PricingPlans } from './PricingPlans';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full h-[90vh] relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center p-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Mejora tu experiencia
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <PricingPlans />
        </div>
      </div>
    </div>
  );
};