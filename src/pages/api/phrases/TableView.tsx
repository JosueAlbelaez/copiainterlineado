import { PlayCircle, Clock } from 'lucide-react';
import VoiceRecorder from '../VoiceRecorder';
import { PhraseProgress } from './PhraseProgress';

interface TableViewProps {
  phrases: any[];
  incrementCount: () => Promise<void>;
  isDarkMode: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isProcessing: boolean;
}

export function TableView({ 
  phrases, 
  incrementCount, 
  isDarkMode,
  currentPage = 0,
  totalPages = 1,
  onPageChange,
  isProcessing
}: TableViewProps) {
  const speakPhrase = async (text: string, rate: number = 1) => {
    if ('speechSynthesis' in window && !isProcessing) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        window.speechSynthesis.speak(utterance);
        await incrementCount();
      } catch (error) {
        console.error('Error al reproducir:', error);
      }
    }
  };

  const renderPaginationButtons = () => (
    <div className="flex justify-center items-center gap-4">
    <button
      onClick={() => onPageChange?.(currentPage - 1)}
      disabled={currentPage === 0 || isProcessing}
      className={`px-4 py-1 
        sm:px-6 sm:py-2 
        md:px-8 md:py-3 
        ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'} 
        text-white rounded-lg disabled:opacity-50 transition-colors`}
    >
      Previous
    </button>
    <span
      className={`text-sm font-medium ${
        isDarkMode ? 'text-gray-200' : 'text-gray-800'
      }`}
    >
      Pág. {currentPage + 1} de {totalPages}
    </span>
    <button
      onClick={() => onPageChange?.(currentPage + 1)}
      disabled={currentPage >= totalPages - 1 || isProcessing}
      className={`px-4 py-1 
        sm:px-6 sm:py-2 
        md:px-8 md:py-3 
        ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'} 
        text-white rounded-lg disabled:opacity-50 transition-colors`}
    >
      Next
    </button>
  </div>
  

  );

  return (
    <div className="w-full space-y-6">
      {/* Botones de navegación superiores */}
      {totalPages > 1 && (
        <div className="mb-6">
          {renderPaginationButtons()}
        </div>
      )}

      {/* Tabla de frases */}
      <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
        <table className="min-w-full">
          <tbody>
            {phrases.map((phrase, index) => (
              <tr key={index} className={`border-b-2 ${isDarkMode ? 'border-gray-600' : ''}`}>
                <td className="p-2 sm:p-4">
                  <div className="flex-col justify-center items-center">
                    <div className="flex-1">
                      <p className={`text-base sm:text-lg font-bold ${
                        isDarkMode ? 'text-green-400' : 'text-green-800'
                      } mb-1`}>
                        {phrase.targetText}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {phrase.translatedText}
                      </p>
                    </div>
                    <div className="flex justify-center py-2 space-x-1">
                      <button
                        onClick={() => speakPhrase(phrase.targetText, 1)}
                        disabled={isProcessing}
                        className={`flex items-center justify-center px-2 py-1 text-xs min-w-[50px] md:px-4 md:py-2 md:text-base md:min-w-[60px] rounded transition-colors ${
                          isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
                        } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <PlayCircle className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button
                        onClick={() => speakPhrase(phrase.targetText, 0.4)}
                        disabled={isProcessing}
                        className={`flex items-center justify-center px-2 py-1 text-xs min-w-[50px] md:px-4 md:py-2 md:text-base md:min-w-[60px] rounded transition-colors ${
                          isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-800 hover:bg-green-600'
                        } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <Clock className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <VoiceRecorder 
                        targetPhrase={phrase.targetText} 
                        isDarkMode={isDarkMode} 
                        resetKey={false}
                        inline={true}
                        resultId={`similarity-result-${index}`}
                      />
                    </div>
                    <div id={`similarity-result-${index}`} className="h-9 pb-2">
                      {/* El resultado de la comparación aparecerá aquí */}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones de navegación inferiores */}
      {totalPages > 1 && (
        <div className="mt-6">
          {renderPaginationButtons()}
        </div>
      )}

      {/* Barra de progreso */}
      <div className="mt-6">
        <PhraseProgress 
          current={(currentPage * 50) + phrases.length}
          total={totalPages * 50}
          showTotal={true}
        />
      </div>
    </div>
  );
}