import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DersYorumlari from '../components/DersYorumlari';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';

export default function EgitimDetay() {
  const { id } = useParams();
  const [ders, setDers] = useState(null);
  const [tamamlandi, setTamamlandi] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const verileriGetir = async () => {
      try {
        // Dersi veritabanından çek
        const docRef = doc(db, "egitimler", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setDers({ id: docSnap.id, ...docSnap.data() });
        }

        // Kullanıcının tamamlayıp tamamlamadığını kontrol et
        if (user) {
          const userDocRef = doc(db, "kullanicilar", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists() && userDocSnap.data().tamamlananDersler?.includes(id)) {
            setTamamlandi(true);
          }
        }
      } catch (error) {
        console.error("Hata:", error);
      }
      setYukleniyor(false);
    };
    verileriGetir();
  }, [id, user]);

  const durumuDegistir = async () => {
    if (!user) return alert("Giriş yapmalısın!");
    const userRef = doc(db, "kullanicilar", user.uid);
    try {
      await setDoc(userRef, { email: user.email }, { merge: true });
      if (tamamlandi) {
        await updateDoc(userRef, { tamamlananDersler: arrayRemove(id) });
        setTamamlandi(false);
      } else {
        await updateDoc(userRef, { tamamlananDersler: arrayUnion(id) });
        setTamamlandi(true);
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  if (yukleniyor) return <div className="min-h-screen flex items-center justify-center text-primary font-bold">Yükleniyor...</div>;
  if (!ders) return <div className="p-10 text-center">Ders bulunamadı!</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display pb-10">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-40 flex justify-center py-5 sm:py-10">
        <div className="flex flex-col w-full max-w-[960px] flex-1 gap-6">
          
          <div className="flex justify-between items-center">
             <Link to="/egitim" className="flex items-center gap-2 text-gray-500 hover:text-primary font-bold">
               <span className="material-symbols-outlined">arrow_back</span> Tüm Eğitimler
             </Link>
             <button onClick={durumuDegistir} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${tamamlandi ? "bg-green-100 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600 hover:bg-primary hover:text-white"}`}>
               <span className="material-symbols-outlined">{tamamlandi ? "check_circle" : "radio_button_unchecked"}</span>
               {tamamlandi ? "Tamamlandı" : "Tamamlandı Olarak İşaretle"}
             </button>
          </div>

          {ders.videoUrl && (
            <div className="relative bg-black aspect-video rounded-xl overflow-hidden shadow-lg">
              <iframe className="w-full h-full" src={ders.videoUrl} title={ders.baslik} allowFullScreen></iframe>
            </div>
          )}

          <div>
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold mt-4 mb-2">{ders.baslik}</h1>
            <p className="text-gray-600 dark:text-gray-300">{ders.detayliAciklama || ders.ozet}</p>
          </div>

          {ders.adimlar && (
            <div className="flex flex-col gap-4 mt-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Adımlar</h3>
              {ders.adimlar.map((adim, i) => (
                <div key={i} className="flex gap-4 bg-white dark:bg-[#2a2015] p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="bg-primary/10 text-primary w-8 h-8 flex items-center justify-center rounded-lg font-bold">{i+1}</div>
                  <p className="text-gray-800 dark:text-gray-200">{adim}</p>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
             <DersYorumlari dersId={ders.id} />
          </div>

        </div>
      </div>
    </div>
  );
}