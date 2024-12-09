import React from 'react';
import { Moon, Sun, Play, Pause, Square, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { useReadingStore } from '../store/useReadingStore';
import logo from '../img/logo.png';

export const ReadingNavbar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { isPlaying, setIsPlaying, playbackRate, setPlaybackRate } = useReadingStore();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    window.speechSynthesis.cancel();
  };

  const handleSlowPlayback = () => {
    setPlaybackRate(0.4);
  };
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 py-3 flex-wrap md:flex-nowrap">
          {/* Logo y título */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16" />
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#00BF63] dark:text-[#00BF63] truncate">
              Interlineal Fluent Phrases
            </span>
          </Link>
  
          {/* Controles y botones */}
          <div className="flex items-center space-x-1 sm:space-x-1 md:space-x-1 mt-1 md:mt-0 flex-wrap">
            {/* Botón Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="p-1 sm:p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#FF3131]" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#00BF63]" />
              )}
            </button>
  
            {/* Botón Stop */}
            <button
              onClick={handleStop}
              className="p-1 sm:p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Stop"
            >
              <Square className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#00BF63]" />
            </button>
  
            {/* Botón Slow Playback */}
            <button
              onClick={handleSlowPlayback}
              className={`p-1 sm:p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${
                playbackRate === 0.4 ? 'bg-gray-200 dark:bg-gray-700' : ''
              }`}
              aria-label="Slow Playback"
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#00BF63]" />
            </button>
  
            {/* Botón Tema */}
            <button
              onClick={toggleTheme}
              className="p-1 sm:p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
  
  
  
};