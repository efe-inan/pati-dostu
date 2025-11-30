import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { egitimListesi } from '../egitimVerileri';

export default function Profil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  
  // --- SENİN VERDİĞİN API KEY ---
  const IMGBB_API_KEY = "25c31e87078bf8c4f6614980803bd85c"; 
  // -----------------------------

  const [isim, setIsim] = useState(user?.displayName || "");
  const [petAdi, setPetAdi] = useState("");
  const [petTur, setPetTur] = useState("Kedi");
  const [petCins, setPetCins] = useState("");
  const [petYas, setPetYas] = useState("");
  
  const [foto, setFoto] = useState(null);
  const [fotoUrl, setFotoUrl] = useState(user?.photoURL || `https://ui-avatars.com/api/?name=${user?.email}&background=random`);

  const [tamamlananlar, setTamamlananlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return navigate("/giris");
    
    const veriGetir = async () => {
      try {
        const docRef = doc(db, "kullanicilar", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setPetAdi(data.petAdi || "");
          setPetTur(data.petTur || "Kedi");
          setPetCins(data.petCins || "");
          setPetYas(data.petYas || "");
          setTamamlananlar(data.tamamlananDersler || []);
          if(data.photoURL) setFotoUrl(data.photoURL);
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };
    veriGetir();
  }, [navigate]);

  const kaydet = async (e) => {
    e.preventDefault();
    setYukleniyor(true);
    try {
      let yeniFotoUrl = fotoUrl;

      // FOTOĞRAF YÜKLEME (IMGBB)
      if (foto) {
        const formData = new FormData();
        formData.append("image", foto);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
          method: "POST",
          body: formData,
        });
        
        const data = await response.json();
        if (data.success) {
          yeniFotoUrl = data.data.url;
        } else {
          console.error("ImgBB Hatası:", data);
          throw new Error("Resim yüklenemedi. Lütfen daha küçük bir resim deneyin.");
        }
      }

      // Profil Güncelle
      await updateProfile(auth.currentUser, { 
        displayName: isim,
        photoURL: yeniFotoUrl 
      });
      setFotoUrl(yeniFotoUrl);
      
      // Veritabanı Güncelle
      await setDoc(doc(db, "kullanicilar", user.uid), {
        email: user.email,
        petAdi,
        petTur,
        petCins,
        petYas,
        photoURL: yeniFotoUrl 
      }, { merge: true });

      alert("Profil güncellendi! 🎉");
    } catch (error) {
      alert("Hata: " + error.message);
    }
    setYukleniyor(false);
  };

  const getPetEmoji = (tur) => {
    const map = { "Köpek": "🐶", "Kedi": "🐱", "Kuş": "🐦", "Balık": "🐠", "Kemirgen": "🐹", "Sürüngen": "🐢" };
    return map[tur] || "🐾";
  };

  const ilerlemeYuzdesi = Math.round((tamamlananlar.length / (egitimListesi.length || 1)) * 100) || 0;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-10 px-4 font-display transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Profilim</h1>
          <p className="text-gray-500 dark:text-gray-400">Kişisel bilgilerin ve küçük dostunun detayları.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#2a2015] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
              <div className="relative inline-block group">
                <img className="w-24 h-24 rounded-full mx-auto border-4 border-primary p-1 object-cover" src={foto ? URL.createObjectURL(foto) : fotoUrl} alt="Avatar" />
                <label className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer hover:bg-orange-600 shadow-sm">
                  <span className="material-symbols-outlined text-sm block">edit</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setFoto(e.target.files[0])} />
                </label>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">{isim || "İsimsiz"}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <form onSubmit={kaydet} className="bg-white dark:bg-[#2a2015] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Senin Adın</label>
                <input type="text" value={isim} onChange={e => setIsim(e.target.value)} className="w-full mt-1 p-2 rounded-lg border dark:bg-white/5 dark:border-gray-700 dark:text-white text-sm focus:border-primary outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Evcil Hayvanın Adı</label>
                <input type="text" value={petAdi} onChange={e => setPetAdi(e.target.value)} className="w-full mt-1 p-2 rounded-lg border dark:bg-white/5 dark:border-gray-700 dark:text-white text-sm focus:border-primary outline-none" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                   <label className="text-xs font-bold text-gray-500 uppercase">Türü</label>
                   <select value={petTur} onChange={e => setPetTur(e.target.value)} className="w-full mt-1 p-2 rounded-lg border dark:bg-white/5 dark:border-gray-700 dark:text-white text-sm focus:border-primary outline-none">
                     <option>Kedi</option><option>Köpek</option><option>Kuş</option><option>Balık</option><option>Kemirgen</option><option>Sürüngen</option><option>Diğer</option>
                   </select>
                </div>
                <div className="w-20">
                   <label className="text-xs font-bold text-gray-500 uppercase">Yaşı</label>
                   <input type="number" value={petYas} onChange={e => setPetYas(e.target.value)} className="w-full mt-1 p-2 rounded-lg border dark:bg-white/5 dark:border-gray-700 dark:text-white text-sm focus:border-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Cinsi / Irkı</label>
                <input type="text" value={petCins} onChange={e => setPetCins(e.target.value)} className="w-full mt-1 p-2 rounded-lg border dark:bg-white/5 dark:border-gray-700 dark:text-white text-sm focus:border-primary outline-none" />
              </div>
              <button disabled={yukleniyor} className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors">
                {yukleniyor ? "Yükleniyor..." : "Kaydet"}
              </button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-primary/10 dark:bg-primary/5 p-6 rounded-2xl border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-primary">Akademi İlerlemen</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">% {ilerlemeYuzdesi} tamamlandı.</p>
               </div>
               <div className="w-16 h-16 flex items-center justify-center rounded-full border-4 border-primary text-lg font-black text-primary bg-white dark:bg-[#2a2015]">
                 %{ilerlemeYuzdesi}
               </div>
            </div>
            
            {petAdi && (
              <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="relative z-10 flex items-center gap-6">
                   <div className="text-5xl bg-white/20 p-4 rounded-full backdrop-blur-sm shadow-inner">{getPetEmoji(petTur)}</div>
                   <div>
                      <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-1">Benim Can Dostum</p>
                      <h3 className="text-4xl font-black tracking-tight">{petAdi}</h3>
                      <div className="flex items-center gap-2 mt-2 text-white/90 font-medium">
                        <span>{petTur}</span>
                        {petCins && <><span>•</span><span className="bg-white/20 px-2 py-0.5 rounded text-sm">{petCins}</span></>}
                        {petYas && <><span>•</span><span>{petYas} Yaşında</span></>}
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}