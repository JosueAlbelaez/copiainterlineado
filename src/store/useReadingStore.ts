import { create } from 'zustand';
import { Reading } from '../types';

interface ReadingState {
  readings: Reading[];
  selectedReading: Reading | null;
  isPlaying: boolean;
  playbackRate: number;
}

interface ReadingActions {
  setReadings: (readings: Reading[]) => void;
  setSelectedReading: (reading: Reading | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setPlaybackRate: (rate: number) => void;
}

export const useReadingStore = create<ReadingState & ReadingActions>((set) => ({
  readings: [],
  selectedReading: null,
  isPlaying: false,
  playbackRate: 1,
  setReadings: (readings) => set(() => ({ readings })),
  setSelectedReading: (reading) => set(() => ({ selectedReading: reading })),
  setIsPlaying: (isPlaying) => set(() => ({ isPlaying })),
  setPlaybackRate: (rate) => set(() => ({ playbackRate: rate })),
}));