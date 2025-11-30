import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import OnayModal from '../components/OnayModal';

export default function Forum() {
  const [konular, setKonular] = useState([]);
  const [baslik, setBaslik] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [kategori, setKategori] = useState("Genel");
  const [aktifKategori, setAktifKategori] = useState("Tümü");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [aktifKullanici, setAktifKullanici] = useState(null);


  const [kaydedilenler, setKaydedilenler] = useState([]);

  const [modalAcik, setModalAcik] = useState(false);
  const [silinecekId, setSilinecekId] = useState(null);

  const KATEGORILER = ["Genel", "Sağlık", "Beslenme", "Eğitim", "Oyun & Eğlence", "Sahiplendirme"];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setAktifKullanici(user);

      if (user) {
        const userSnap = await getDoc(doc(db, "kullanicilar", user.uid));
        if (userSnap.exists()) setKaydedilenler(userSnap.data().favoriKonular || []);
      }
    });

    const q = query(collection(db, "forum_mesajlari"), orderBy("tarih", "desc"));
    const unsubscribeDb = onSnapshot(q, (snapshot) => {
      setKonular(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubscribeAuth(); unsubscribeDb(); }
  }, []);


  const kaydetToggle = async (e, konuId) => {
    e.preventDefault();
    if (!aktifKullanici) return toast.error("Giriş yapmalısın!");

    const userRef = doc(db, "kullanicilar", aktifKullanici.uid);
    const kayitliMi = kaydedilenler.includes(konuId);

    try {
      if (kayitliMi) {
        await updateDoc(userRef, { favoriKonular: arrayRemove(konuId) });
        setKaydedilenler(prev => prev.filter(id => id !== konuId));
        toast.success("Kaydedilenlerden çıkarıldı.");
      } else {
        await updateDoc(userRef, { favoriKonular: arrayUnion(konuId) });
        setKaydedilenler(prev => [...prev, konuId]);
        toast.success("Konu kaydedildi! 📌");
      }
    } catch (error) { toast.error("Hata oluştu."); }
  };

  const isminiTemizle = (isim) => {
    if (!isim) return "Anonim";
    return isim.split('@')[0];
  };

  const gonder = async (e) => {
    e.preventDefault();
    if (!baslik || !mesaj) return toast.error("Lütfen boş alan bırakma! ✍️");
    if (!aktifKullanici) return toast.error("Giriş yapmalısın!");

    setYukleniyor(true);
    try {
      const temizIsim = aktifKullanici.displayName || isminiTemizle(aktifKullanici.email);
      await addDoc(collection(db, "forum_mesajlari"), {
        baslik,
        icerik: mesaj,
        kategori: kategori,
        tarih: new Date(),
        yazar: temizIsim,
        yazarUid: aktifKullanici.uid,
        avatar: aktifKullanici.photoURL || `https://ui-avatars.com/api/?name=${temizIsim}&background=random`,
        begenenler: []
      });
      setBaslik(""); setMesaj("");
      toast.success("Konu paylaşıldı! 🎉");
    } catch (error) { toast.error("Hata: " + error.message); }
    setYukleniyor(false);
  };

  const begeniDegistir = async (e, mesajId, begenenlerListesi = []) => {
    e.preventDefault();
    if (!aktifKullanici) return toast.error("Giriş yapmalısın! ❤️");
    const mesajRef = doc(db, "forum_mesajlari", mesajId);
    const begenmisMi = begenenlerListesi.includes(aktifKullanici.uid);
    try { await updateDoc(mesajRef, { begenenler: begenmisMi ? arrayRemove(aktifKullanici.uid) : arrayUnion(aktifKullanici.uid) }); }
    catch (e) { toast.error("Hata oluştu."); }
  };

  const silmeIstegi = (e, id) => { e.preventDefault(); setSilinecekId(id); setModalAcik(true); };
  const islemiOnayla = async () => { if (silinecekId) { try { await deleteDoc(doc(db, "forum_mesajlari", silinecekId)); toast.success("Konu silindi! 🗑️"); } catch (error) { toast.error("Silinemedi."); } } setModalAcik(false); setSilinecekId(null); };

  const filtrelenmisKonular = konular.filter(konu => aktifKategori === "Tümü" || konu.kategori === aktifKategori);

  return (
    <main className="flex flex-1 justify-center py-5 sm:py-8 lg:py-10 px-4 bg-background-light dark:bg-background-dark min-h-screen font-display transition-colors duration-300">
      <OnayModal acik={modalAcik} baslik="Konuyu Sil" mesaj="Bu işlem geri alınamaz." onOnay={islemiOnayla} onIptal={() => setModalAcik(false)} />
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <div className="flex gap-2 overflow-x-auto pb-2 [-ms-scrollbar-style:none] [scrollbar-width:none]">
          <button onClick={() => setAktifKategori("Tümü")} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${aktifKategori === "Tümü" ? "bg-primary text-white" : "bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100"}`}>Tümü</button>
          {KATEGORILER.map(kat => (<button key={kat} onClick={() => setAktifKategori(kat)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${aktifKategori === kat ? "bg-primary text-white" : "bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100"}`}>{kat}</button>))}
        </div>

        <div className="flex flex-col gap-4 rounded-xl bg-white dark:bg-[#2a2015] p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-[#181511] dark:text-white">Konu Başlat</h3>
          {aktifKullanici ? (
            <form onSubmit={gonder} className="flex w-full flex-col gap-3">
              <div className="flex gap-3">
                <input type="text" className="flex-1 rounded-lg border-gray-300 bg-[#f8f7f5] dark:bg-gray-800 dark:border-gray-700 dark:text-white p-3" placeholder="Başlık..." value={baslik} onChange={(e) => setBaslik(e.target.value)} />
                <select className="w-1/3 rounded-lg border-gray-300 bg-[#f8f7f5] dark:bg-gray-800 dark:border-gray-700 dark:text-white p-3" value={kategori} onChange={(e) => setKategori(e.target.value)}>{KATEGORILER.map(k => <option key={k} value={k}>{k}</option>)}</select>
              </div>
              <div className="flex flex-col items-end gap-2">
                <textarea className="w-full min-h-[100px] rounded-lg border-gray-300 bg-[#f8f7f5] dark:bg-gray-800 dark:border-gray-700 dark:text-white p-3" placeholder="Neler oluyor?" value={mesaj} onChange={(e) => setMesaj(e.target.value)}></textarea>
                <button type="submit" disabled={yukleniyor} className="min-w-[100px] rounded-lg h-10 px-5 bg-primary text-white font-bold hover:bg-orange-600 transition-colors disabled:opacity-50">{yukleniyor ? "..." : "Paylaş"}</button>
              </div>
            </form>
          ) : (<div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded text-orange-800 dark:text-orange-200 text-center">Konu açmak için <Link to="/giris" className="font-bold underline">Giriş Yap</Link>.</div>)}
        </div>

        <div className="flex flex-col gap-4">
          {filtrelenmisKonular.length === 0 ? (<p className="text-center text-gray-500 dark:text-gray-400 mt-10">İçerik yok.</p>) : (
            filtrelenmisKonular.map((konu) => {
              const begenenler = konu.begenenler || [];
              const begenildi = aktifKullanici && begenenler.includes(aktifKullanici.uid);
              const favoride = kaydedilenler.includes(konu.id);
              const silmeYetkisi = aktifKullanici && (aktifKullanici.uid === konu.yazarUid || aktifKullanici.email === "efe_nbhd@outlook.com");

              return (
                <Link to={`/forum/${konu.id}`} key={konu.id} className="block group">
                  <div className="flex flex-col rounded-xl bg-white dark:bg-[#2a2015] shadow-sm border border-gray-100 dark:border-gray-800 group-hover:border-primary/50 transition-colors relative">


                    <button onClick={(e) => kaydetToggle(e, konu.id)} className="absolute top-4 right-4 text-gray-300 hover:text-primary z-10 p-1">
                      <span className={`material-symbols-outlined ${favoride ? "text-primary fill-current" : ""}`} style={{ fontVariationSettings: favoride ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
                    </button>

                    {silmeYetkisi && (
                      <button onClick={(e) => silmeIstegi(e, konu.id)} className="absolute top-4 right-12 text-gray-300 hover:text-red-500 z-10 p-1"><span className="material-symbols-outlined">delete</span></button>
                    )}

                    <div className="p-4 sm:p-5">
                      <div className="flex justify-between items-start"><span className="text-xs font-bold text-primary bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded mb-2 inline-block">{konu.kategori || "Genel"}</span></div>
                      <h4 className="text-[#181511] dark:text-white text-lg font-bold pr-16">{konu.baslik}</h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-3">{konu.icerik}</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                        <img src={konu.avatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                        <p className="text-xs text-gray-500 font-bold">{isminiTemizle(konu.yazar)} <span className="font-normal opacity-70"> · {konu.tarih?.seconds ? new Date(konu.tarih.seconds * 1000).toLocaleDateString() : ""}</span></p>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-b-xl flex gap-4">
                      <button onClick={(e) => begeniDegistir(e, konu.id, begenenler)} className={`flex items-center gap-2 z-10 relative ${begenildi ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}><span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: begenildi ? "'FILL' 1" : "'FILL' 0" }}>favorite</span><span className="text-sm font-bold">{begenenler.length}</span></button>
                      <div className="flex items-center gap-2 text-gray-500"><span className="material-symbols-outlined text-xl">chat_bubble</span><span className="text-sm font-bold">Yorumlar</span></div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}