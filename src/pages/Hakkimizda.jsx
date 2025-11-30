import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Hakkimizda() {
  const [metin, setMetin] = useState("Yükleniyor...");

  useEffect(() => {
    const getir = async () => {
      const snap = await getDoc(doc(db, "site_ayarlari", "genel"));
      if (snap.exists()) setMetin(snap.data().hakkimizdaMetni);
    };
    getir();
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display py-16 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">Biz Kimiz?</h1>
        <div className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed space-y-6 text-left whitespace-pre-wrap">
          {metin}
        </div>
      </div>
    </div>
  );
}