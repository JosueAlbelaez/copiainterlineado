import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { usePhrases } from '../lib/hooks/usePhrases';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const categories = [
  'Conversations',
  'Technology',
  'Literature',
  'Work',
  'Studies',
  'Short Stories',
  'Home',
  'Travel',
  'Food',
  'Entertainment',
  'Health',
  'City',
  'Nature',
  'Irregular Verbs'
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, userRole } = usePhrases('en', 'all');
  
  console.log("🔹 Estado de autenticación:", { isAuthenticated, userRole });

  const FREE_CATEGORIES = ['Conversations', 'Technology'];

  const isCategoryLocked = (category: string) => {
    if (!isAuthenticated || userRole === 'free') {
      return !FREE_CATEGORIES.includes(category);
    }
    return false;
  };
  console.log("📌 Renderizando CategoryFilter...");
  return (
    <div className="mb-8">
      <div className="sm:hidden flex justify-end mb-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      <div className={`flex flex-wrap gap-2 transition-all duration-300 ${isMenuOpen ? 'block' : 'hidden'} sm:flex`}>
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory 
              ? 'bg-[#00BF63] text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          All
        </button>

        {categories.map((category) => {
          const locked = isCategoryLocked(category);
          return (
            <button
              key={category}
              onClick={() => !locked && onSelectCategory(category)}
              disabled={locked}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors relative ${
                selectedCategory === category
                  ? 'bg-[#00BF63] text-white'
                  : `bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 ${
                      locked ? 'opacity-50 cursor-not-allowed' : ''
                    }`
              }`}
            >
              {category}
              {locked && (
                <Lock className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500 bg-white rounded-full p-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};