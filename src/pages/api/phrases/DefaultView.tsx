import { useState } from 'react';
import { Clock, PlayCircle } from 'lucide-react';
import VoiceRecorder from '../VoiceRecorder';
import { PhraseProgress } from './PhraseProgress';

interface Phrase {
  _id: string;
  targetText: string;
  translatedText: string;
  category: string;
  language: string;
}

interface DefaultViewProps {
  phrases: Phrase[];
  incrementCount: () => Promise<void>;
  isDarkMode: boolean;
  isProcessing: boolean;
  language: string;
  category?: string;
  showProgress: boolean; // Nueva prop para controlar la barra de progreso
}

export const DefaultView = ({
  phrases,
  incrementCount,
  isDarkMode,
  isProcessing,
  showProgress, // Recibe la nueva prop
}: DefaultViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetRecorder, setResetRecorder] = useState(false);

  // Verificar si no hay frases disponibles
  if (!phrases || phrases.length === 0) {
    return (
      <div className="text-center p-8">
        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          No hay frases disponibles en esta categoría.
        </p>
      </div>
    );
  }

  // Obtener la frase actual
  const currentPhrase = phrases[currentIndex];

  if (!currentPhrase) {
    return (
      <div className="text-center p-8">
        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Error al cargar la frase actual.
        </p>
      </div>
    );
  }

  // Función para avanzar a la siguiente frase
  const handleNext = () => {
    if (currentIndex < phrases.length - 1 && !isProcessing) {
      setCurrentIndex(currentIndex + 1);
      setResetRecorder((prev) => !prev);
      incrementCount().catch((error) => {
        console.error('Error al incrementar:', error);
      });
    }
  };

  // Función para retroceder a la frase anterior
  const handlePrevious = () => {
    if (currentIndex > 0 && !isProcessing) {
      setCurrentIndex(currentIndex - 1);
      setResetRecorder((prev) => !prev);
    }
  };

  // Función para reproducir la frase actual
  const handleSpeak = async (rate: number = 1) => {
    if ('speechSynthesis' in window && !isProcessing) {
      try {
        const utterance = new SpeechSynthesisUtterance(currentPhrase.targetText);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error al reproducir:', error);
      }
    }
  };

  return (
    <div className="text-center space-y-6">
      {/* Botones de navegación */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0 || isProcessing}
          className={`px-4 py-2 ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === phrases.length - 1 || isProcessing}
          className={`px-4 py-2 ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Next
        </button>
      </div>

      {/* Barra de progreso */}
      {showProgress && (
        <div className="mb-4">
          <PhraseProgress
            current={currentIndex + 1}
            total={phrases.length}
            showTotal={true}
          />
        </div>
      )}

      {/* Frase actual */}
      <div className="mb-4">
        <h2
          className={`text-2xl font-bold mb-2 ${
            isDarkMode ? 'text-green-300' : 'text-green-800'
          }`}
        >
          {currentPhrase.targetText}
        </h2>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          {currentPhrase.translatedText}
        </p>
      </div>

      {/* Botones de interacción */}
      <div className="flex justify-center space-x-1">
        <button
          onClick={() => handleSpeak(1)}
          disabled={isProcessing}
          className={`flex items-center justify-center px-2 py-1 text-sm min-w-[50px] md:px-4 md:py-2 md:text-base md:min-w-[70px] ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <PlayCircle className="mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5" />
          Speak
        </button>
        <button
          onClick={() => handleSpeak(0.4)}
          disabled={isProcessing}
          className={`flex items-center justify-center px-2 py-1 text-sm min-w-[50px] md:px-4 md:py-2 md:text-base md:min-w-[70px] ${
            isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
          } text-white rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Clock className="mr-1 w-4 h-4 md:mr-2 md:w-5 md:h-5" />
          Slow
        </button>
        <VoiceRecorder
          targetPhrase={currentPhrase.targetText}
          isDarkMode={isDarkMode}
          resetKey={resetRecorder}
          inline={true}
        />
      </div>

      {/* Resultado de la comparación */}
      <div id="similarity-result" className="h-8">
        {/* El resultado de la comparación aparecerá aquí */}
      </div>
    </div>
  );
};
