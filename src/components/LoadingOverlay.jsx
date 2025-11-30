import React from 'react';

export default function LoadingOverlay({ yukleniyor, mesaj }) {
  if (!yukleniyor) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white dark:bg-[#2a2015] p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-bounce-slow border border-gray-100 dark:border-gray-800">
        {/* Dönen Pati */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🐾</div>
        </div>
        
        <p className="text-lg font-bold text-gray-800 dark:text-white animate-pulse">
          {mesaj || "İşlem yapılıyor..."}
        </p>
      </div>
    </div>
  );
}