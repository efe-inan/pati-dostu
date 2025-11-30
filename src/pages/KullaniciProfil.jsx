import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function KullaniciProfil() {
  const { uid } = useParams(); // URL'den kullanıcının ID'sini alacağız
  const navigate = useNavigate();
  
  const [kullanici, setKullanici] = useState(null);
  const [konular, setKonular] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const verileriGetir = async () => {
      try {
        // 1. Kullanıcı Bilgilerini Çek
        const userDoc = await getDoc(doc(db, "kullanicilar", uid));
        
        if (!userDoc.exists()) {
          alert("Böyle bir kullanıcı bulunamadı!");
          navigate("/forum");
          return;
        }
        setKullanici(userDoc.data());

        // 2. Kullanıcının Açtığı Konuları Çek
        const q = query(
          collection(db, "forum_mesajlari"), 
          where("yazarUid", "==", uid),
          orderBy("tarih", "desc")
        );
        const postsSnap = await getDocs(q);
        setKonular(postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Hata:", error);
      }
      setYukleniyor(false);
    };

    if (uid) verileriGetir();
  }, [uid, navigate]);

  // Pet Emojisi
  const getPetEmoji = (tur) => {
    const map = { "Köpek": "🐶", "Kedi": "🐱", "Kuş": "🐦", "Balık": "🐠", "Kemirgen": "🐹", "Sürüngen": "🐢" };
    return map[tur] || "🐾";
  };

  // İsim Gizleme (Güvenlik)
  const isminiTemizle = (email) => email ? email.split('@')[0] : "Anonim";

  if (yukleniyor) return <div className="min-h-screen flex items-center justify-center dark:text-white">Profil yükleniyor...</div>;
  if (!kullanici) return null;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-10 px-4 font-display transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* --- BAŞLIK KARTI --- */}
        <div className="bg-white dark:bg-[#2a2015] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
          {/* Arka plan süsü */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-transparent"></div>
          
          <div className="relative">
            <img 
              className="w-32 h-32 rounded-full mx-auto border-4 border-white dark:border-[#2a2015] shadow-lg object-cover"
              src={kullanici.photoURL || `https://ui-avatars.com/api/?name=${kullanici.email}&background=random&size=128`} 
              alt="Avatar" 
            />
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-4">
              {kullanici.email ? isminiTemizle(kullanici.email) : "İsimsiz Üye"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">PatiDostu Üyesi</p>
            <p className="text-xs text-gray-400 mt-1">Katılım: {kullanici.kayitTarihi?.seconds ? new Date(kullanici.kayitTarihi.seconds * 1000).toLocaleDateString() : "Eskiden beri"}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* --- SOL: PATİ KARTI (Varsa) --- */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">pets</span>
              Can Dostu
            </h3>
            
            {kullanici.petAdi ? (
              <div className="bg-gradient-to-br from-primary to-orange-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden transform hover:scale-[1.02] transition-transform">
                <div className="absolute -right-6 -top-6 text-9xl opacity-10 rotate-12">
                  {getPetEmoji(kullanici.petTur)}
                </div>
                
                <div className="relative z-10">
                   <div className="text-5xl mb-4">{getPetEmoji(kullanici.petTur)}</div>
                   <h2 className="text-4xl font-black tracking-tight mb-1">{kullanici.petAdi}</h2>
                   <div className="flex flex-wrap gap-2 text-orange-100 font-medium text-sm">
                     <span className="bg-white/20 px-3 py-1 rounded-full">{kullanici.petTur}</span>
                     {kullanici.petCins && <span className="bg-white/20 px-3 py-1 rounded-full">{kullanici.petCins}</span>}
                     {kullanici.petYas && <span className="bg-white/20 px-3 py-1 rounded-full">{kullanici.petYas} Yaşında</span>}
                   </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-2xl text-center text-gray-500 border border-dashed border-gray-300 dark:border-gray-700">
                Henüz evcil hayvan bilgisi girmemiş. 😿
              </div>
            )}
          </div>

          {/* --- SAĞ: AÇTIĞI KONULAR --- */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">forum</span>
              Paylaşımları ({konular.length})
            </h3>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {konular.length === 0 ? (
                <p className="text-gray-500 italic">Henüz hiç konu açmamış.</p>
              ) : (
                konular.map((konu) => (
                  <div key={konu.id} 
                       onClick={() => navigate(`/forum/${konu.id}`)}
                       className="bg-white dark:bg-[#2a2015] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md cursor-pointer transition-all hover:border-primary/30 group">
                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{konu.baslik}</h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{konu.icerik}</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                      <span className="text-xs font-bold text-primary bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded">{konu.kategori}</span>
                      <span className="text-xs text-gray-400">{konu.tarih?.seconds ? new Date(konu.tarih.seconds * 1000).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}