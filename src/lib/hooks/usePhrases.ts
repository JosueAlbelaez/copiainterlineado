
import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/use-toast';
import { authAPI, contentAPI } from '../../services/api';

interface Phrase {
  _id: string;
  targetText: string;
  translatedText: string;
  category: string;
  language: string;
}

interface UsePhraseReturn {
  phrases: Phrase[];
  isLoading: boolean;
  dailyCount: number;
  incrementDailyCount: () => Promise<void>;
  error: string | null;
  isAuthenticated: boolean;
  userRole: string;
  refresh: () => Promise<void>;
  currentPhraseIndex: number;
  goToNextPhrase: () => void;
  goToPreviousPhrase: () => void;
  currentPhrase: Phrase | null;
}

export function usePhrases(language: string, category?: string): UsePhraseReturn {
  const { toast } = useToast();
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyCount, setDailyCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('free');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const loadPhrases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const authResponse = await authAPI.get('/api/auth/me');
      setIsAuthenticated(true);
      setUserRole(authResponse.data.role);

      const phrasesResponse = await contentAPI.get('/api/phrases', {
        params: { language, category }
      });

      setPhrases(phrasesResponse.data.phrases || []);
      setDailyCount(phrasesResponse.data.userInfo?.dailyPhrasesCount || 0);
      setCurrentPhraseIndex(0);

    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al cargar las frases';
      console.error('Error loading phrases:', err);
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = async () => {
    await loadPhrases();
  };

  useEffect(() => {
    loadPhrases();
  }, [language, category]);

  const incrementDailyCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (userRole === 'free') {
        const response = await contentAPI.post('/phrases/increment');
        setDailyCount(response.data.dailyPhrasesCount);
      }
    } catch (err: any) {
      const message = err.response?.data?.error || 'Error al incrementar el contador diario';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    }
  };

  const goToNextPhrase = () => {
    if (currentPhraseIndex < phrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1);
    }
  };

  const goToPreviousPhrase = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(prev => prev - 1);
    }
  };

  const currentPhrase = phrases[currentPhraseIndex] || null;

  return {
    phrases,
    isLoading,
    dailyCount,
    incrementDailyCount,
    error,
    isAuthenticated,
    userRole,
    refresh,
    currentPhraseIndex,
    goToNextPhrase,
    goToPreviousPhrase,
    currentPhrase
  };
}