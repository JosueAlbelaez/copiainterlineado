import React from 'react';
import { Reading } from '../types';
import { Book } from 'lucide-react';

interface ReadingCardProps {
  reading: Reading;
  onClick: () => void;
}

export const ReadingCard: React.FC<ReadingCardProps> = ({ reading, onClick }) => {
  const hasImage = reading.imageUrl && reading.imageUrl.trim() !== '';

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer
                 transform transition-transform duration-200 hover:scale-105"
    >
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
          <span className="inline-block px-3 py-1 mt-2 text-sm font-medium text-[#FF3131] 
                         bg-red-100 dark:bg-red-900 dark:text-red-100 rounded-full">
            {reading.category}
          </span>
        </div>
      </div>
    </div>
  );
};