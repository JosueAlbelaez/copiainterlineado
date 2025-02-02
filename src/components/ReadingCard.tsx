import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reading } from '../types';
import { Book, Lock } from 'lucide-react';
import { PricingModal } from './subscription/PricingModal';

interface ReadingCardProps {
  reading: Reading;
  onClick: () => void;
  isLocked: boolean;
}

export const ReadingCard: React.FC<ReadingCardProps> = ({ reading, onClick, isLocked }) => {
  const navigate = useNavigate();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const hasImage = reading.imageUrl && reading.imageUrl.trim() !== '';

  const handleClick = () => {
    if (isLocked) {
      setShowPricingModal(true);
    } else {
      onClick();
      navigate(`/reading/${reading._id}`);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 
                   transform transition-transform duration-200 relative
                   ${isLocked 
                      ? 'opacity-75 cursor-pointer hover:opacity-100' 
                      : 'cursor-pointer hover:scale-105'}`}
      >
        {isLocked && (
          <div className="absolute top-2 right-2 bg-white dark:bg-gray-900 p-1 rounded-full">
            <Lock className="w-5 h-5 text-yellow-500" />
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          {hasImage ? (
            <img
              src={reading.imageUrl}
              alt={reading.title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement?.querySelector('.book-icon')?.classList.remove('hidden');
              }}
              className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
            />
          ) : (
            <Book className="w-12 h-12 text-[#00BF63] flex-shrink-0" />
          )}
          <div className="book-icon hidden">
            <Book className="w-12 h-12 text-[#00BF63]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {reading.title}
            </h3>
            <span className="inline-block px-3 py-1 mt-2 text-sm font-medium text-[#00BF63] 
                           bg-green-100 dark:bg-green-900 dark:text-green-100 rounded-full">
              {reading.category}
            </span>
          </div>
        </div>
        
        {isLocked && (
          <div className="mt-4 text-sm text-yellow-600 dark:text-yellow-400">
            Actualiza a premium para acceder a este contenido
          </div>
        )}
      </div>

      <PricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)} 
      />
    </>
  );
};