import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryFilter } from '../components/CategoryFilter';
import { ReadingCard } from '../components/ReadingCard';
import { useReadingStore } from '../store/useReadingStore';
import { Category } from '../types';import { FaLinkedin, FaGithub } from 'react-icons/fa'; // Importar íconos de react-icons


export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { readings, setSelectedReading } = useReadingStore();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const filteredReadings = selectedCategory
    ? readings.filter((reading) => reading.category === selectedCategory)
    : readings;

  const handleReadingClick = (readingId: string) => {
    const reading = readings.find((r) => r._id === readingId);
    if (reading) {
      setSelectedReading(reading);
      navigate(`/reading/${readingId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
   
    

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReadings.map((reading) => (
          <ReadingCard
            key={reading._id}
            reading={reading}
            onClick={() => handleReadingClick(reading._id)}
          />
        ))}
      </div>
      <footer className="mt-6 text-center text-green-700 py-4">
  <div className="inline-flex px-4 flex-col  md:flex-row bg-black/90 rounded py-2 justify-center items-center space-x-0 md:space-x-4">
    <p >
      Creado por{' '}
      <a
        href="https://josuealbelaez.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-700 font-bold hover:text-white shadow hover:shadow-green-900/60 transition duration-300"
      >
        JOSUÉ ALBELÁEZ
      </a>
    </p>
    <div className="flex justify-center space-x-4 mt-4 md:mt-0">
      <a
        href="https://www.linkedin.com/in/juanjosuealbelaez/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-700 hover:text-white shadow hover:shadow-green-900/60 transition duration-300"
      >
        <FaLinkedin size={24} />
      </a>
      <a
        href="https://github.com/JosueAlbelaez"
        target="_blank"
        rel="noopener noreferrer"
       className="text-green-700 hover:text-white shadow hover:shadow-green-900/60 transition duration-300"
      >
        <FaGithub size={24} />
      </a>
    </div>
  </div>
</footer>
    </div>
  );
};