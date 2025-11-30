import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast'; 
import OnayModal from './OnayModal'; 

export default function ForumYorumlari({ konuId }) {
  const [yorumlar, setYorumlar] = useState([]);
  const [yeniYorum, setYeniYorum] = useState("");
  const [silinecekYorumId, setSilinecekYorumId] = useState(null);
  const [modalAcik, setModalAcik] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "forum_yorumlari"), where("konuId", "==", konuId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const veri = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      veri.sort((a, b) => a.tarih - b.tarih);
      setYorumlar(veri);
    });
    return () => unsubscribe();
  }, [konuId]);

  // --- İSİM TEMİZLEME YARDIMCISI ---
  const isminiTemizle = (isim) => {
    if (!isim) return "Anonim";
    return isim.split('@')[0];
  };

  const yorumYap = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return toast.error("Giriş yapmalısın!");
    if (!yeniYorum.trim()) return;

    try {
      const temizIsim = auth.currentUser.displayName || isminiTemizle(auth.currentUser.email);

      await addDoc(collection(db, "forum_yorumlari"), {
        konuId: konuId,
        text: yeniYorum,
        yazar: auth.currentUser.email,
        yazarIsim: temizIsim, // E-posta yerine temiz isim kaydet
        yazarUid: auth.currentUser.uid,
        tarih: new Date(),
        avatar: auth.currentUser.photoURL || `https://ui-avatars.com/api/?name=${temizIsim}&background=random`
      });
      setYeniYorum("");
      toast.success("Yorumun eklendi!");
    } catch (error) { toast.error("Hata oluştu."); }
  };

  const silmeIstegi = (id) => { setSilinecekYorumId(id); setModalAcik(true); };
  const islemiOnayla = async () => {
    if (silinecekYorumId) {
      try { await deleteDoc(doc(db, "forum_yorumlari", silinecekYorumId)); toast.success("Silindi 👋"); } 
      catch (error) { toast.error("Hata: " + error.message); }
    }
    setModalAcik(false); setSilinecekYorumId(null);
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
      <OnayModal acik={modalAcik} baslik="Yorumu Sil?" mesaj="Geri alınamaz." onOnay={islemiOnayla} onIptal={() => setModalAcik(false)} />
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Yorumlar ({yorumlar.length})</h3>
      
      <div className="space-y-6 mb-8">
        {yorumlar.length === 0 && <p className="text-gray-500 text-sm">Henüz yorum yok.</p>}
        {yorumlar.map((yorum) => {
          const silmeYetkisi = auth.currentUser && (auth.currentUser.uid === yorum.yazarUid || auth.currentUser.email === "efe_nbhd@outlook.com");
          return (
            <div key={yorum.id} className="flex gap-3 items-start group relative">
              <img src={yorum.avatar} alt="Avatar" className="w-8 h-8 rounded-full mt-1 object-cover" />
              <div className="flex-1 bg-gray-50 dark:bg-white/5 p-3 rounded-xl rounded-tl-none relative hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                {silmeYetkisi && (
                  <button onClick={() => silmeIstegi(yorum.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"><span className="material-symbols-outlined text-sm">close</span></button>
                )}
                <div className="flex justify-between items-baseline mb-1 mr-4">
                  {/* BURASI DÜZELTİLDİ 👇 */}
                  <span className="font-bold text-sm text-gray-900 dark:text-white">{isminiTemizle(yorum.yazarIsim)}</span>
                  <span className="text-xs text-gray-400">{yorum.tarih?.seconds ? new Date(yorum.tarih.seconds * 1000).toLocaleDateString() : "Az önce"}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{yorum.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        {auth.currentUser ? (
          <>
            <img src={auth.currentUser.photoURL || `https://ui-avatars.com/api/?name=${auth.currentUser.email}&background=random`} alt="Ben" className="w-10 h-10 rounded-full object-cover" />
            <form onSubmit={yorumYap} className="flex-1 relative">
              <textarea className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[50px] pr-12 dark:text-white" placeholder="Bir şeyler yaz..." value={yeniYorum} onChange={(e) => setYeniYorum(e.target.value)} />
              <button type="submit" className="absolute right-2 bottom-2 text-primary hover:text-orange-600 p-1"><span className="material-symbols-outlined">send</span></button>
            </form>
          </>
        ) : (
          <div className="w-full p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl text-center text-orange-800 dark:text-orange-200 text-sm">Yorum yapmak için <a href="/giris" className="font-bold underline">Giriş Yap</a></div>
        )}
      </div>
    </div>
  );
}