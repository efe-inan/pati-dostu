import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Arama() {
  const [searchParams] = useSearchParams();
  const arananKelime = searchParams.get('q') || ""; 
  
  const [sonuclar, setSonuclar] = useState({ egitimler: [], forum: [] });
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const aramaYap = async () => {
      setYukleniyor(true);
      const kucukKelime = arananKelime.toLowerCase().trim();

      if (!kucukKelime) {
        setYukleniyor(false);
        return;
      }

      try {
        const [egitimSnap, forumSnap] = await Promise.all([
          getDocs(collection(db, "egitimler")),
          getDocs(collection(db, "forum_mesajlari"))
        ]);

        // GÜVENLİ ARAMA (Veri yoksa boş string sayar, çökmez)
        const bulunanEgitimler = egitimSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => 
            (item.baslik || "").toLowerCase().includes(kucukKelime) || 
            (item.ozet || "").toLowerCase().includes(kucukKelime)
          );

        const bulunanForum = forumSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => 
            (item.baslik || "").toLowerCase().includes(kucukKelime) || 
            (item.icerik || "").toLowerCase().includes(kucukKelime)
          );

        setSonuclar({ egitimler: bulunanEgitimler, forum: bulunanForum });
      } catch (error) {
        console.error("Arama hatası:", error);
      }
      setYukleniyor(false);
    };

    aramaYap();
  }, [arananKelime]);

  if (yukleniyor) return <div className="min-h-screen flex items-center justify-center dark:text-white">Aranıyor...</div>;

  const toplamSonuc = sonuclar.egitimler.length + sonuclar.forum.length;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display py-10 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {toplamSonuc === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-10 animate-fadeIn">
            <div className="relative w-64 h-64 mb-6">
              <div className="absolute inset-0 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-2xl"></div>
              {/* Üzgün Kedi Resmi */}
              <img 
                src="https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=600&auto=format&fit=crop" 
                alt="Üzgün Kedi" 
                className="relative w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
              />
              <div className="absolute bottom-4 right-4 text-4xl">😿</div>
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
              Tüh! Sonuç Bulamadık.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto mb-8">
              "<strong>{arananKelime}</strong>" ile ilgili bir şey bulamadık. Belki kelimeyi yanlış yazdın ya da henüz bu konuda bir pati izi yok.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/forum">
                <button className="px-8 py-3 rounded-full bg-primary text-white font-bold hover:bg-orange-600 transition-transform hover:-translate-y-1 shadow-lg">
                  Konuyu Forumda Sen Aç!
                </button>
              </Link>
              <Link to="/">
                <button className="px-8 py-3 rounded-full bg-white dark:bg-white/10 text-gray-700 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/20 transition-colors border border-gray-200 dark:border-gray-700">
                  Ana Sayfaya Dön
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
              "{arananKelime}" için {toplamSonuc} sonuç bulundu
            </h1>

            {/* EĞİTİM SONUÇLARI */}
            {sonuclar.egitimler.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">school</span> Eğitimler ({sonuclar.egitimler.length})
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {sonuclar.egitimler.map(ders => (
                    <Link to={`/egitim/${ders.id}`} key={ders.id} className="group bg-white dark:bg-[#2a2015] p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{ders.baslik}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{ders.ozet}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* FORUM SONUÇLARI */}
            {sonuclar.forum.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">forum</span> Forum Mesajları ({sonuclar.forum.length})
                </h2>
                <div className="space-y-4">
                  {sonuclar.forum.map(mesaj => (
                    <Link to={`/forum/${mesaj.id}`} key={mesaj.id} className="block group bg-white dark:bg-[#2a2015] p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={mesaj.avatar || `https://ui-avatars.com/api/?name=${mesaj.yazar}`} className="w-6 h-6 rounded-full" alt="" />
                        <span className="text-xs text-gray-500">{mesaj.yazar}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{mesaj.baslik}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{mesaj.icerik}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}