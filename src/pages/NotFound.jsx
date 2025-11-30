import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col items-center justify-center p-4 text-center transition-colors duration-300">
      
      {/* Görsel */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-8">
        <div className="absolute inset-0 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl animate-pulse"></div>
        <img 
          src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=600&auto=format&fit=crop" 
          alt="Şaşkın Kedi" 
          className="relative w-full h-full object-cover rounded-full border-8 border-white dark:border-gray-800 shadow-2xl"
        />
        <div className="absolute -bottom-2 -right-2 text-6xl animate-bounce">
          🐾
        </div>
      </div>

      {/* Yazılar */}
      <h1 className="text-6xl font-black text-primary mb-2">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Oops! Patiler Karıştı...
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto mb-8">
        Aradığın sayfayı bulamadık. Belki silinmiştir, belki de bizim kediler kabloyu kemirmiştir.
      </p>

      {/* Butonlar */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/">
          <button className="px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-orange-600 transition-transform hover:-translate-y-1 shadow-lg flex items-center gap-2">
            <span className="material-symbols-outlined">home</span>
            Eve Dön
          </button>
        </Link>
        <Link to="/forum">
          <button className="px-8 py-3 rounded-full bg-white dark:bg-white/10 text-gray-700 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/20 transition-colors border border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <span className="material-symbols-outlined">forum</span>
            Foruma Bak
          </button>
        </Link>
      </div>

    </div>
  );
}