import { useEffect, useState } from 'react';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';

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
        return;
      }

      const authResponse = await axios.get('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsAuthenticated(true);
      setUserRole(authResponse.data.role);

      const phrasesResponse = await axios.get('/api/phrases', {
        params: { language, category },
        headers: { Authorization: `Bearer ${token}` }
      });

      setPhrases(phrasesResponse.data.phrases);
      setDailyCount(phrasesResponse.data.userInfo.dailyPhrasesCount);
      setCurrentPhraseIndex(0);

    } catch (error: any) {
      const message = error.response?.data?.error || 'Error al cargar las frases';
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
  }, [language, category, userRole]);

  const incrementDailyCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (userRole === 'free') {
        const response = await axios.post('/api/phrases/increment', null, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setDailyCount(response.data.dailyPhrasesCount);
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Error al incrementar el contador diario';
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
