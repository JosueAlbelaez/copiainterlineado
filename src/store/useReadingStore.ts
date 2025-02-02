import { create } from 'zustand';
import { Reading } from '../types';
import { getReadings } from '../services/api';

interface ReadingState {
  readings: Reading[];
  selectedReading: Reading | null;
  isPlaying: boolean;
  playbackRate: number;
  isLoading: boolean;
  error: string | null;
}

interface ReadingActions {
  setReadings: (readings: Reading[]) => void;
  setSelectedReading: (reading: Reading | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  fetchReadings: () => Promise<void>;
}

export const useReadingStore = create<ReadingState & ReadingActions>((set) => ({
  readings: [],
  selectedReading: null,
  isPlaying: false,
  playbackRate: 1,
  isLoading: false,
  error: null,
  setReadings: (readings) => set(() => ({ readings })),
  setSelectedReading: (reading) => set(() => ({ selectedReading: reading })),
  setIsPlaying: (isPlaying) => set(() => ({ isPlaying })),
  setPlaybackRate: (rate) => set(() => ({ playbackRate: rate })),
  fetchReadings: async () => {
    try {
      set({ isLoading: true, error: null });
      const readings = await getReadings();
      set({ readings, isLoading: false });
    } catch (error) {
      console.error('Error fetching readings:', error);
      set({ 
        error: 'Error al cargar las lecturas', 
        isLoading: false 
      });
    }
  }
}));