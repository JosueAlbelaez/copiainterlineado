import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryFilter } from '../components/CategoryFilter';
import { ReadingCard } from '../components/ReadingCard';
import { useReadingStore } from '../store/useReadingStore';
import { FaLinkedin, FaInstagram, FaTiktok } from 'react-icons/fa';
import { Mail, Phone, MapPin } from 'lucide-react';
import logo from '../img/logo.png';
import { useThemeStore } from '../store/useThemeStore';
import { usePhrases } from '../lib/hooks/usePhrases';
import { FreeLimitAlert } from '../components/phrases/FreeLimitAlert';

const currentYear = new Date().getFullYear();

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { readings, setSelectedReading, fetchReadings } = useReadingStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isAuthenticated, userRole, dailyCount } = usePhrases('en', selectedCategory || undefined);
  
  const isPremium = userRole === 'premium' || userRole === 'admin';
  const DAILY_LIMIT = 5;
  const FREE_CATEGORIES = ['Conversations', 'Technology'];

  useEffect(() => {
    console.log('🏠 Cargando lecturas...');
    fetchReadings().catch(error => {
      console.error('Error al cargar lecturas:', error);
    });
  }, [fetchReadings]);

  const handleCategorySelect = (category: string | null) => {
    if (!isPremium && category && !FREE_CATEGORIES.includes(category)) {
      return;
    }
    setSelectedCategory(category);
  };

  const filteredReadings = selectedCategory
    ? readings.filter((reading) => reading.category === selectedCategory)
    : readings;

  const handleReadingClick = (readingId: string) => {
    if (!isPremium && dailyCount >= DAILY_LIMIT) return;
    
    const reading = readings.find((r) => r._id === readingId);
    if (reading) {
      setSelectedReading(reading);
      navigate(`/reading/${readingId}`);
    }
  };

  const isDarkMode = useThemeStore();

  console.log("🏠 Renderizando Home.tsx...");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {!isPremium && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Artículos restantes hoy: {DAILY_LIMIT - dailyCount}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-green-600 h-2.5 rounded-full"
              style={{ width: `${(dailyCount / DAILY_LIMIT) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReadings.map((reading) => (
          <ReadingCard
            key={reading._id}
            reading={reading}
            onClick={() => handleReadingClick(reading._id)}
            isLocked={!isPremium && !FREE_CATEGORIES.includes(reading.category)}
          />
        ))}
      </div>

      {!isPremium && dailyCount >= DAILY_LIMIT && (
        <FreeLimitAlert 
          isOpen={true}
          onClose={() => {/* Lógica para cerrar el alert */}}
        />
      )}

      
    </div>
  );
};