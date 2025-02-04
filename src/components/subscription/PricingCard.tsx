import React from 'react';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  interval: string;
  onSubscribe: () => void;
  isLoading?: boolean;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  interval,
  onSubscribe,
  isLoading = false,
}: PricingCardProps) {
  return (
    <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">{description}</p>
      </div>
      <div className="px-6 pb-6 space-y-4">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">${price}</span>
          <span className="text-gray-500 dark:text-gray-400">/{interval}</span>
        </div>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onSubscribe}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Procesando..." : "Suscribirse"}
        </button>
      </div>
    </div>
  );
}