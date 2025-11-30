import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Egitim() {
  const [aktifFiltre, setAktifFiltre] = useState("Tümü");
  const [dersler, setDersler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [kaydedilenler, setKaydedilenler] = useState([]); // Kullanıcının kaydettikleri

  useEffect(() => {
    const veriCek = async () => {
      try {
        // 1. Dersleri Çek
        const snap = await getDocs(collection(db, "egitimler"));
        const veri = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDersler(veri);

        // 2. Kullanıcının Kaydettiklerini Çek
        if (auth.currentUser) {
          const userSnap = await getDoc(doc(db, "kullanicilar", auth.currentUser.uid));
          if (userSnap.exists()) {
            setKaydedilenler(userSnap.data().favoriEgitimler || []);
          }
        }
      } catch (error) { console.error(error); }
      setYukleniyor(false);
    };
    veriCek();
  }, []);

  const kaydetToggle = async (e, dersId) => {
    e.preventDefault(); // Linke gitmeyi engelle
    if (!auth.currentUser) return toast.error("Kaydetmek için giriş yapmalısın!");

    const userRef = doc(db, "kullanicilar", auth.currentUser.uid);
    const kayitliMi = kaydedilenler.includes(dersId);

    try {
      if (kayitliMi) {
        await updateDoc(userRef, { favoriEgitimler: arrayRemove(dersId) });
        setKaydedilenler(prev => prev.filter(id => id !== dersId));
        toast.success("Favorilerden çıkarıldı.");
      } else {
        await updateDoc(userRef, { favoriEgitimler: arrayUnion(dersId) });
        setKaydedilenler(prev => [...prev, dersId]);
        toast.success("Favorilere eklendi! 🔖");
      }
    } catch (error) { toast.error("Hata oluştu."); }
  };

  const filtrelenmisDersler = dersler.filter(ders => {
    if (aktifFiltre === "Tümü") return true;
    return ders.tur === aktifFiltre;
  });

  if (yukleniyor) return <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-primary font-bold">Eğitimler Yükleniyor...</div>;

  return (
    <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-10 bg-background-light dark:bg-background-dark min-h-screen font-display transition-colors duration-300">
      <div className="flex flex-col max-w-[960px] flex-1 gap-8">
        
        <div className="flex flex-col gap-2">
          <h1 className="text-[#181511] dark:text-white text-4xl font-black leading-tight tracking-tight">PatiDostu Akademi</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-normal">Kedinize ve köpeğinize dair her şeyi uzman rehberlerle öğrenin.</p>
        </div>

        <div className="flex p-1 bg-gray-100 dark:bg-white/10 rounded-xl w-full sm:w-fit">
          {["Tümü", "Kedi", "Köpek"].map((filtre) => (
            <button key={filtre} onClick={() => setAktifFiltre(filtre)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex-1 sm:flex-none ${aktifFiltre === filtre ? "bg-white dark:bg-gray-700 text-[#181511] dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/5"}`}>{filtre === "Tümü" ? "Tümü" : `${filtre} Eğitimleri`}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrelenmisDersler.map((ders) => {
            const favoride = kaydedilenler.includes(ders.id);
            return (
              <div key={ders.id} className="relative flex flex-col gap-4 p-5 bg-white dark:bg-[#2a2015] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                
                {/* KAYDET BUTONU */}
                <button 
                  onClick={(e) => kaydetToggle(e, ders.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-black/20 hover:bg-white shadow-sm transition-colors text-gray-400 hover:text-primary"
                >
                  <span className={`material-symbols-outlined ${favoride ? "text-primary fill-current" : ""}`} style={{ fontVariationSettings: favoride ? "'FILL' 1" : "'FILL' 0" }}>
                    bookmark
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ders.tur === 'Kedi' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>{ders.tur}</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">{ders.seviye}</span>
                </div>
                <div className="flex flex-col gap-2 flex-grow">
                  <h3 className="text-[#181511] dark:text-white text-lg font-bold leading-tight pr-8">{ders.baslik}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">{ders.ozet}</p>
                </div>
                <Link to={`/egitim/${ders.id}`}>
                  <button className="w-full h-10 rounded-lg bg-primary text-white text-sm font-bold hover:bg-orange-600 transition-colors shadow-md">Derse Başla</button>
                </Link>
              </div>
            );
          })}
        </div>
        {filtrelenmisDersler.length === 0 && <div className="text-center py-20 text-gray-500">Henüz eğitim bulunmuyor.</div>}
      </div>
    </main>
  );
}