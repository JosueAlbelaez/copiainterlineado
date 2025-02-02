import { useState, useEffect } from 'react';
import { usePhrases } from '@/lib/hooks/usePhrases';
import { FreeLimitAlert } from './FreeLimitAlert';
import { PhraseProgress } from './PhraseProgress';
import { UserCircle2, LogIn } from 'lucide-react';
import { SignInForm } from '../auth/SignInForm';
import { SignUpForm } from '../auth/SignUpForm';
import { TableView } from './TableView';
import { DefaultView } from './DefaultView';

const TABLE_VIEW_CATEGORIES = [
  '1000 Nouns',
  'Adjectives and Adverbs',
  'Prepositions and Conjunctions',
  'Articles, Determiners and Interjections',
];

interface PhrasesContainerProps {
  language: string;
  category?: string;
}

export function PhrasesContainer({ language, category }: PhrasesContainerProps) {
  const [showAuthModal, setShowAuthModal] = useState<'signin' | 'signup' | null>(null);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    phrases: allPhrases,
    isLoading,
    dailyCount,
    incrementDailyCount,
    error,
    isAuthenticated,
    userRole,
  } = usePhrases(language, category);

  const DAILY_LIMIT = 20;
  const ITEMS_PER_PAGE = 50;
  const isPremium = userRole === 'premium' || userRole === 'admin';

  const getRandomPhrases = (phrases: any[], count: number) => {
    if (phrases.length <= count) return phrases;
    const shuffled = [...phrases].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  let filteredPhrases =
    category && category !== 'Todas las categorías'
      ? allPhrases.filter((phrase) => phrase.category === category)
      : allPhrases;

  if (isPremium && category === 'Todas las categorías') {
    filteredPhrases = getRandomPhrases(filteredPhrases, 10);
  }

  const totalPages = Math.ceil(filteredPhrases.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(0);
  }, [category, language]);

  const handleAuthSuccess = () => {
    setShowAuthModal(null);
    // Aquí puedes agregar cualquier lógica adicional que necesites después del éxito de autenticación
    window.location.reload(); // Recargar la página para actualizar el estado de autenticación
  };

  const handlePhraseInteraction = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      if (!isAuthenticated) {
        setShowAuthModal('signin');
        return;
      }

      if (!isPremium && dailyCount >= DAILY_LIMIT) {
        setShowLimitAlert(true);
        return;
      }

      await incrementDailyCount();
    } catch (error) {
      console.error('Error en la interacción:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
          <div className="text-center space-y-4">
            <UserCircle2 className="w-16 h-16 mx-auto text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Inicia sesión o regístrate gratis
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Para acceder a todas las frases y comenzar a practicar, necesitas iniciar sesión o
              crear una cuenta gratuita.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAuthModal('signin')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar sesión
            </button>
            <button
              onClick={() => setShowAuthModal('signup')}
              className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              Registrarse gratis
            </button>
          </div>
        </div>

        {showAuthModal === 'signin' && (
          <SignInForm onAuthSuccess={handleAuthSuccess} />
        )}
        {showAuthModal === 'signup' && (
          <SignUpForm onAuthSuccess={handleAuthSuccess} />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      {!isPremium && (
        <div className="mb-6">
          <PhraseProgress current={dailyCount} total={DAILY_LIMIT} showTotal={true} />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="w-12 h-12 border-4 border-green-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center p-8">
          <p className="text-red-600 dark:text-red-400">
            {typeof error === 'string' ? error : 'Error al cargar las frases'}
          </p>
        </div>
      ) : filteredPhrases.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-600 dark:text-gray-400">No hay frases disponibles en esta categoría.</p>
        </div>
      ) : TABLE_VIEW_CATEGORIES.includes(category || '') ? (
        <TableView
          phrases={filteredPhrases}
          incrementCount={handlePhraseInteraction}
          isDarkMode={document.documentElement.classList.contains('dark')}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
          isProcessing={isProcessing}
        />
      ) : (
        <DefaultView
          phrases={filteredPhrases}
          incrementCount={handlePhraseInteraction}
          isDarkMode={document.documentElement.classList.contains('dark')}
          isProcessing={isProcessing}
          language={language}
          category={category}
          showProgress={isPremium}
        />
      )}

      {!isPremium && (
        <FreeLimitAlert isOpen={showLimitAlert} onClose={() => setShowLimitAlert(false)} />
      )}
    </div>
  );
}