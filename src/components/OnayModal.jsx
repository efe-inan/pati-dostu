import React from 'react';

export default function OnayModal({ acik, baslik, mesaj, onOnay, onIptal }) {
  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#2a2015] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 dark:border-gray-800 transform scale-100 transition-all">
        
        {/* Üst Kısım */}
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">warning</span>
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{baslik}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{mesaj}</p>
        </div>

        {/* Butonlar */}
        <div className="flex border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={onIptal}
            className="flex-1 py-4 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Vazgeç
          </button>
          <button 
            onClick={onOnay}
            className="flex-1 py-4 text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-l border-gray-100 dark:border-gray-700"
          >
            Evet, Sil
          </button>
        </div>

      </div>
    </div>
  );
}