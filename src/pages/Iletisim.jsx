import React from 'react';

export default function Iletisim() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display py-16 px-4 transition-colors duration-300">
      <div className="max-w-xl mx-auto bg-white dark:bg-[#2a2015] p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">mail</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">İletişime Geç</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Bir sorunun mu var? Bize yazmaktan çekinme.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Konu</label>
            <input type="text" className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/20 dark:text-white focus:outline-none focus:border-primary" placeholder="Örn: İşbirliği" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mesajın</label>
            <textarea className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/20 dark:text-white focus:outline-none focus:border-primary h-32 resize-none" placeholder="Bize ne söylemek istersin?"></textarea>
          </div>

          <button className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-transform hover:-translate-y-1 shadow-lg">
            Gönder Gitsin 🚀
          </button>
          
          <p className="text-xs text-center text-gray-400 mt-4">
            Veya bize direkt e-posta at: <strong className="text-primary">efe_nbhd@outlook.com</strong>
          </p>
        </div>

      </div>
    </div>
  );
}