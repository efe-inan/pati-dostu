import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

export default function Favorilerim() {
  const navigate = useNavigate();
  const [egitimler, setEgitimler] = useState([]);
  const [konular, setKonular] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return navigate("/giris");

    const veriGetir = async () => {
      try {
        // 1. Kullanıcının kayıtlı ID'lerini çek
        const userSnap = await getDoc(doc(db, "kullanicilar", auth.currentUser.uid));
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const favEgitimIds = userData.favoriEgitimler || [];
          const favKonuIds = userData.favoriKonular || [];

          // 2. Tüm içerikleri çek (Firestore'da 'where in' sorgusu limitli olduğu için hepsini çekip filtrelemek daha güvenli şimdilik)
          const [egitimSnap, konuSnap] = await Promise.all([
            getDocs(collection(db, "egitimler")),
            getDocs(collection(db, "forum_mesajlari"))
          ]);

          // 3. Eşleşenleri Filtrele
          const bulunanEgitimler = egitimSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(d => favEgitimIds.includes(d.id));

          const bulunanKonular = konuSnap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(d => favKonuIds.includes(d.id));

          setEgitimler(bulunanEgitimler);
          setKonular(bulunanKonular);
        }
      } catch (error) { console.error("Hata:", error); }
      setYukleniyor(false);
    };
    veriGetir();
  }, [navigate]);

  if (yukleniyor) return <div className="min-h-screen flex items-center justify-center dark:text-white">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display py-10 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Kaydettiklerim 🔖</h1>
          <p className="text-gray-500 dark:text-gray-400">Daha sonra incelemek üzere ayırdığın içerikler.</p>
        </div>

        {/* EĞİTİMLER */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">school</span> Kayıtlı Eğitimler ({egitimler.length})
          </h2>
          {egitimler.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {egitimler.map(ders => (
                <div key={ders.id} className="bg-white dark:bg-[#2a2015] p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">{ders.tur}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{ders.baslik}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{ders.ozet}</p>
                  <Link to={`/egitim/${ders.id}`}>
                    <button className="w-full h-10 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">Derse Git</button>
                  </Link>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 italic">Henüz kaydedilmiş bir eğitim yok.</p>}
        </div>

        {/* FORUM KONULARI */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">forum</span> Kayıtlı Konular ({konular.length})
          </h2>
          {konular.length > 0 ? (
            <div className="space-y-4">
              {konular.map(konu => (
                <Link to={`/forum/${konu.id}`} key={konu.id} className="block group bg-white dark:bg-[#2a2015] p-5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={konu.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                    <span className="text-xs text-gray-500 font-bold">{konu.yazar}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 ml-auto">{konu.kategori || "Genel"}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{konu.baslik}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{konu.icerik}</p>
                </Link>
              ))}
            </div>
          ) : <p className="text-gray-500 italic">Henüz kaydedilmiş bir konu yok.</p>}
        </div>

      </div>
    </div>
  );
}