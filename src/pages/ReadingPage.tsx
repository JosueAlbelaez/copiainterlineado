import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { ReadingContent } from '../components/ReadingContent';
import { ReadingNavbar } from '../components/ReadingNavbar';
import { useReadingStore } from '../store/useReadingStore';
import { ArrowLeft } from 'lucide-react';
//import { Category } from '../types';
import { FaLinkedin, FaGithub } from 'react-icons/fa'; // Importar íconos de react-icons

export const ReadingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { readings, selectedReading, setSelectedReading } = useReadingStore();

  useEffect(() => {
    if (id && (!selectedReading || selectedReading._id !== id)) {
      const reading = readings.find((r) => r._id === id);
      if (reading) {
        setSelectedReading(reading);
      } else {
        navigate('/');
      }
    }
  }, [id, readings, selectedReading, setSelectedReading, navigate]);

  if (!selectedReading) {
    return null;
  }

  return (
    <>
      <ReadingNavbar />
       
      <div className="pt-20 pb-12">
       
        <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 
                     hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Readings</span>
          </button>

          <ReadingContent reading={selectedReading} />
        </div>
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
    </>
  );
};