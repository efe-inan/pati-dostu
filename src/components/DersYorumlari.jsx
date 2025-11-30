import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

export default function DersYorumlari({ dersId }) {
  const [yorumlar, setYorumlar] = useState([]);
  const [yeniYorum, setYeniYorum] = useState("");

  // Yorumları Çek
  useEffect(() => {
    const q = query(collection(db, "ders_yorumlari"), where("dersId", "==", dersId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const veri = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      veri.sort((a, b) => b.tarih - a.tarih);
      setYorumlar(veri);
    });
    return () => unsubscribe();
  }, [dersId]);

  const yorumYap = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return alert("Yorum yapmak için giriş yapmalısın!");
    if (!yeniYorum) return;

    try {
      await addDoc(collection(db, "ders_yorumlari"), {
        dersId: dersId,
        text: yeniYorum,
        yazar: auth.currentUser.email,
        tarih: new Date(),
        avatar: `https://ui-avatars.com/api/?name=${auth.currentUser.email}&background=random`
      });
      setYeniYorum("");
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-[#181511] dark:text-white">
        Soru & Cevap ({yorumlar.length})
      </h2>

      {/* Yorum Formu */}
      <div className="flex gap-4">
        {auth.currentUser && (
          <img 
            className="size-10 rounded-full border border-gray-200" 
            src={`https://ui-avatars.com/api/?name=${auth.currentUser.email}&background=random`} 
            alt="Profil"
          />
        )}
        <div className="flex-1">
          {auth.currentUser ? (
            <form onSubmit={yorumYap}>
              <textarea 
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-primary focus:ring-primary transition p-3 min-h-[80px]" 
                placeholder="Bu eğitim hakkında bir sorun var mı?" 
                value={yeniYorum}
                onChange={(e) => setYeniYorum(e.target.value)}
              ></textarea>
              <button className="mt-2 px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-sm">
                Yorum Yap
              </button>
            </form>
          ) : (
            <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-lg text-gray-600 dark:text-gray-300">
              Soru sormak için lütfen <a href="/giris" className="text-primary font-bold hover:underline">Giriş Yapın</a>.
            </div>
          )}
        </div>
      </div>

      {/* Yorum Listesi */}
      <div className="flex flex-col gap-6 mt-4">
        {yorumlar.map((yorum) => (
          <div key={yorum.id} className="flex gap-4 animate-fadeIn">
            <img 
              className="size-10 rounded-full ring-2 ring-gray-100 dark:ring-gray-700" 
              src={yorum.avatar || `https://ui-avatars.com/api/?name=${yorum.yazar}`} 
              alt="User"
            />
            <div className="flex-1">
              <div className="bg-white dark:bg-[#2a2015] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-[#181511] dark:text-white text-sm">{yorum.yazar}</p>
                  <p className="text-xs text-[#8a7960] dark:text-gray-400">
                    {yorum.tarih?.seconds ? new Date(yorum.tarih.seconds * 1000).toLocaleDateString() : "Az önce"}
                  </p>
                </div>
                <p className="text-[#343A40] dark:text-gray-300 text-sm leading-relaxed">
                  {yorum.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}