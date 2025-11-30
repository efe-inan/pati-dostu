import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import ForumYorumlari from '../components/ForumYorumlari';

export default function ForumDetay() {
  const { id } = useParams();
  const [konu, setKonu] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const getir = async () => {
      try {
        const docRef = doc(db, "forum_mesajlari", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setKonu({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Hata:", error);
      }
      setYukleniyor(false);
    };
    getir();
  }, [id]);

  // --- İSİM TEMİZLEME YARDIMCISI ---
  const isminiTemizle = (isim) => {
    if (!isim) return "Anonim";
    return isim.split('@')[0];
  };

  if (yukleniyor) return <div className="min-h-screen pt-20 text-center dark:text-white">Yükleniyor...</div>;
  if (!konu) return <div className="min-h-screen pt-20 text-center dark:text-white">Konu bulunamadı.</div>;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display py-10 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        
        {/* Geri Dön */}
        <Link to="/forum" className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 font-bold transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
          Foruma Dön
        </Link>

        {/* Ana Konu Kartı */}
        <div className="bg-white dark:bg-[#2a2015] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
          
          {/* Başlık ve Yazar */}
          <div className="flex items-start gap-4 mb-6">
            {/* Avatar Linki */}
            <Link to={`/kullanici/${konu.yazarUid}`}>
              <img 
                src={konu.avatar || `https://ui-avatars.com/api/?name=${konu.yazar}&background=random`} 
                className="w-12 h-12 rounded-full border-2 border-gray-100 dark:border-gray-700 hover:border-primary transition-colors" 
                alt="Yazar" 
              />
            </Link>
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                {konu.baslik}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {/* İsim Linki */}
                <Link to={`/kullanici/${konu.yazarUid}`} className="font-bold hover:text-primary hover:underline transition-colors">
                  {isminiTemizle(konu.yazar)}
                </Link> 
                {' '}tarafından • {konu.tarih?.seconds ? new Date(konu.tarih.seconds * 1000).toLocaleDateString() : "Az önce"}
              </p>
            </div>
          </div>

          {/* İçerik */}
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
            {konu.icerik}
          </div>

          {/* Yorumlar Bölümü */}
          <ForumYorumlari konuId={id} />

        </div>
      </div>
    </div>
  );
}