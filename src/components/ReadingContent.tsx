import React, { useEffect, useRef, useState } from 'react';
import { Reading } from '../types';
import { useReadingStore } from '../store/useReadingStore';
import { Play, Pause } from 'lucide-react';

interface ReadingContentProps {
  reading: Reading;
}

export const ReadingContent: React.FC<ReadingContentProps> = ({ reading }) => {
  const { isPlaying, playbackRate } = useReadingStore();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [playingSentenceIndex, setPlayingSentenceIndex] = useState<number | null>(null);
  const [isTitlePlaying, setIsTitlePlaying] = useState(false);

  // Maneja la reproducción global desde el navbar
  useEffect(() => {
    if (isPlaying && reading) {
      const fullText = `${reading.title}. ${reading.english_text}`;
      utteranceRef.current = new SpeechSynthesisUtterance(fullText);
      utteranceRef.current.rate = playbackRate;
      utteranceRef.current.lang = 'en-US';
      window.speechSynthesis.speak(utteranceRef.current);
    } else {
      window.speechSynthesis.cancel();
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isPlaying, reading, playbackRate]);

  // Reproducir solo el título
  const playTitle = () => {
    window.speechSynthesis.cancel();
    if (isTitlePlaying) {
      setIsTitlePlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(reading.title);
    utterance.rate = playbackRate;
    utterance.lang = 'en-US';

    utterance.onend = () => {
      setIsTitlePlaying(false);
    };

    setIsTitlePlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  // Reproducir una oración individual
  const playSentence = (sentence: string, index: number) => {
    window.speechSynthesis.cancel();
    
    if (playingSentenceIndex === index) {
      setPlayingSentenceIndex(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.rate = playbackRate;
    utterance.lang = 'en-US';

    utterance.onend = () => {
      setPlayingSentenceIndex(null);
    };

    setPlayingSentenceIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const englishSentences = reading.english_text
    .split('.')
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);

  const spanishSentences = reading.spanish_translation
    .split('.')
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0);

  return (
    <div className="max-w-4xl mx-auto p-2 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#bc2828] dark:text-[#FF3131]">
          {reading.title}
        </h1>
        <button
          onClick={playTitle}
          className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700
                    transition-colors duration-200"
          aria-label={isTitlePlaying ? 'Pause Title' : 'Play Title'}
        >
          {isTitlePlaying ? (
            <Pause className="w-5 h-5 text-[#FF3131] font-bold" />
          ) : (
            <Play className="w-5 h-5 text-[#135f3a] font-bold dark:text-[#5cffb0]" />
          )}
        </button>
      </div>

      <div className="flex justify-center items-center">
        <img
          src={reading.imageUrl}
          alt={reading.title}
          className="w-[85%] h-auto rounded-lg shadow-lg object-cover
                     sm:max-h-[300px] 
                     md:max-h-[400px] 
                     lg:max-h-[500px] transform scale-75"
        />
      </div>
      
      <div className="space-y-1">
        {englishSentences.map((sentence, index) => (
          <div key={index} className="space-y-0 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xl font-extrabold text-[#135636] dark:text-[#86ffc5] flex-grow">
                {sentence}.
              </p>
              <button
                onClick={() => playSentence(sentence, index)}
                className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700
                          transition-colors duration-200"
                aria-label={playingSentenceIndex === index ? 'Pause' : 'Play Sentence'}
              >
                {playingSentenceIndex === index ? (
                  <Pause className="w-5 h-5 text-[#FF3131] font-bold" />
                ) : (
                  <Play className="w-5 h-5 text-[#135f3a] font-bold dark:text-[#5cffb0]" />
                )}
              </button>
            </div>
            <p className="text-base text-gray-700 dark:text-gray-300 mt-2">
              {spanishSentences[index]}.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};