'use client';

import CarSearch from '../components/CarSearch';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react'; // for dark mode toggle button...

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

  const handleTitleClick = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  useEffect(() => {
    // Optional: Save dark mode preference
    const savedMode = sessionStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <main 
      className={`flex min-h-screen flex-col items-center justify-center p-6 bg-cover bg-center relative transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`} 
      style={{ 
        backgroundImage: darkMode 
          ? 'none' 
          : "url('H:pdc-project/Car-Review-Search-Engine/webapp/frontend/car-search-app/public/img/4k-minimalist-yellow-car-pr1ot44h0hwr6xjr.jpg')"
      }}
    >
      {/* Overlay */}
      {!darkMode && <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />}

      <motion.button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-20 p-2 rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700 transition-colors"
        initial={false}
        animate={{ rotate: darkMode ? 180 : 0, scale: [1, 1.2, 1] }}
        transition={{ duration: 0.4 }}
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Moon className="h-6 w-6 text-yellow-300" />
        ) : (
          <Sun className="h-6 w-6 text-yellow-500" />
        )}
      </motion.button>

      <motion.div 
        className="z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1 
          className="mb-6 text-5xl font-extrabold drop-shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={handleTitleClick}
          whileHover={{ scale: 1.1 }}
        >
          Car Search Engine
        </motion.h1>

        <motion.p 
          className="mb-12 text-lg max-w-2xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Discover, compare, and explore cars from various brands effortlessly. Powered by AI search and re-ranking.
        </motion.p>

        <motion.div 
          className="w-full max-w-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <CarSearch />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-4 text-sm text-center z-10 bg-gray-800 bg-opacity-80 text-white py-2 px-4 rounded-lg">
      <p>© 2025 Car Search Engine. All rights reserved.</p>
      <p>H.Mansoor - M.Mashhood - A. Mohsin</p>
    </div>
    </main>
  );
}
