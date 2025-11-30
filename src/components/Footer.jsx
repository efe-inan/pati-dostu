import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Footer() {
  const [footerYazisi, setFooterYazisi] = useState("© 2025 PatiDostu. Tüm hakları saklıdır.");

  useEffect(() => {
    const getir = async () => {
      try {
        const snap = await getDoc(doc(db, "site_ayarlari", "genel"));
        if (snap.exists() && snap.data().footerMetni) {
          setFooterYazisi(snap.data().footerMetni);
        }
      } catch (error) {
        console.log("Footer veri hatası", error);
      }
    };
    getir();
  }, []);

  return (
    <footer className="w-full max-w-5xl mx-auto flex flex-col gap-6 px-5 py-10 text-center border-t border-gray-200 dark:border-gray-800 mt-16 transition-colors duration-300">
      
      {/* LİNKLER KISMI (Geri Geldi!) */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <Link to="/hakkimizda" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium">
          Hakkımızda
        </Link>
        <Link to="/iletisim" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium">
          İletişim
        </Link>
        <Link to="/kullanim-kosullari" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium">
          Kullanım Koşulları
        </Link>
        <Link to="/gizlilik" className="text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors text-sm font-medium">
          Gizlilik Politikası
        </Link>
      </div>
      
      {/* LOGO ve İSİM */}
      <div className="flex items-center justify-center gap-2 text-orange-500 opacity-80 mt-2">
        <span className="material-symbols-outlined text-lg">pets</span>
        <span className="font-bold text-lg">PatiDostu</span>
      </div>
      
      {/* DİNAMİK ALT YAZI (Panelden Değişen) */}
      <p className="text-gray-400 text-xs">{footerYazisi}</p>
    </footer>
  );
}