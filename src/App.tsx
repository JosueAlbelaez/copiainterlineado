import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { ReadingPage } from './pages/ReadingPage';
import { useThemeStore } from './store/useThemeStore';
import { useReadingStore } from './store/useReadingStore';
import axios from 'axios';

function App() {
  const { isDarkMode } = useThemeStore();
  const { setReadings } = useReadingStore();

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/readings`);
        setReadings(data);
      } catch (error) {
        console.error('Error fetching readings:', error);
        setReadings([]);
      }
    };

    fetchReadings();
  }, [setReadings]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Router>
          <Routes>
            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/reading/:id" element={<ReadingPage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;