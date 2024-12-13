import React, { useState } from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

export const categories: Category[] = [
  'Technology',
  'Literature',
  'Work',
  'Studies',
  'Home',
  'Travel',
  'Food',
  'Entertainment',
  'Health',
  'City',
  'Nature',
  'Irregular Verbs',
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="mb-8">
      {/* Botón de menú hamburguesa visible solo en pantallas pequeñas */}
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700 dark:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Menú de categorías */}
      <div
        className={`flex flex-wrap gap-2 transition-all duration-300 ${
          isMenuOpen ? 'block' : 'hidden'
        } sm:flex`}
      >
        {/* Botón para "All" */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                     ${
                       !selectedCategory
                         ? 'bg-[#00BF63] text-white'
                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                     }`}
        >
          All
        </button>

        {/* Botones de categorías */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                       ${
                         selectedCategory === category
                           ? 'bg-[#00BF63] text-white'
                           : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                       }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
