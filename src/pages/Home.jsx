import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Home() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);

  const [icerik, setIcerik] = useState({
    heroBaslik: "Hoşgeldin Hayvan Dostu!",
    heroAltBaslik: "Kedi ve köpek sahipleri için sıcak, samimi ve güvenilir bir topluluk."
  });

  useEffect(() => {
    const ayarCek = async () => {
      try {
        const docRef = doc(db, "site_ayarlari", "genel");
        const snap = await getDoc(docRef);
        if (snap.exists()) setIcerik(snap.data());
      } catch (error) { console.error(error); }
    };
    ayarCek();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Scroll mesafesini biraz daha uzattım ki geçiş daha yumuşak olsun
      const scrollDistance = height - windowHeight;
      let scrolled = -top;
      let p = scrolled / scrollDistance;

      if (p < 0) p = 0;
      if (p > 1) p = 1;

      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="w-full bg-background-light dark:bg-background-dark transition-colors duration-300">

      {/* --- MOBİL GÖRÜNÜM (Değişmedi) --- */}
      <div className="block lg:hidden px-4 py-12 text-center">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{icerik.heroBaslik}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">{icerik.heroAltBaslik}</p>
        <div className="w-full aspect-square bg-gray-200 bg-cover bg-center rounded-3xl shadow-lg mb-8" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?q=80&w=1000&auto=format&fit=crop)' }}></div>
        <div className="flex gap-4 justify-center">
          <Link to="/forum" className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg">Foruma Katıl</Link>
        </div>
      </div>

      {/* --- MASAÜSTÜ GÖRÜNÜM (Zamanlama Ayarlandı) --- */}
      {/* h-[350vh] yaparak scroll alanını biraz daha uzattık, aceleye gelmesin */}
      <div ref={containerRef} className="hidden lg:block relative h-[350vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

          {/* Arka Plan Bulanıklıkları */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          <div className="absolute top-1/3 -left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>

          <div className="w-full max-w-7xl px-10 relative flex items-center h-full">

            {/* --- 1. SAĞDAN SOLA KAYAN ANA RESİM --- */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-[45%] h-[65vh] bg-gray-200 bg-cover bg-center rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] z-0 transition-all duration-100 ease-out"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?q=80&w=1000&auto=format&fit=crop)',
                left: `${50 - (progress * 45)}%`
              }}
            ></div>


            {/* --- 2. SOL YAZI BLOĞU (Yukarı kayıp silinen) --- */}
            <div
              className="absolute left-0 w-[45%] z-10 transition-all duration-100 ease-out pr-10"
              style={{
                opacity: Math.max(0, 1 - (progress * 2.5)),
                transform: `translateY(-${progress * 150}px)`,
                pointerEvents: progress > 0.4 ? 'none' : 'auto'
              }}
            >
              <span className="bg-orange-100 dark:bg-orange-900/30 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 inline-block">🚀 PatiDostu Yayında!</span>
              <h1 className="text-gray-900 dark:text-white text-6xl font-black leading-tight tracking-tight mb-6">{icerik.heroBaslik}</h1>
              <p className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed mb-8">{icerik.heroAltBaslik}</p>
              <div className="flex gap-4">
                <Link to="/forum"><button className="h-14 px-8 rounded-full bg-primary text-white text-base font-bold hover:bg-orange-600 transition-all shadow-lg hover:-translate-y-1">Topluluğa Katıl</button></Link>
                <Link to="/egitim"><button className="h-14 px-8 rounded-full bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 text-base font-bold transition-all hover:bg-gray-50 dark:hover:bg-white/10">Eğitimleri İncele</button></Link>
              </div>
            </div>


            {/* --- 3. SAĞ YAZI BLOĞU (ZAMANLAMA GECİKTİRİLDİ) --- */}
            <div
              className="absolute right-0 w-[45%] flex flex-col gap-6 transition-all duration-300 ease-out pl-10 z-10"
              style={{
                // DÜZELTME: Progress 0.6'ya (yüzde 60) gelene kadar görünme.
                // 0.6 ile 0.85 arasında yavaşça belir.
                opacity: Math.max(0, Math.min(1, (progress - 0.6) * 4)),
                // DÜZELTME: Daha aşağıdan yukarı doğru süzülerek gel
                transform: `translateY(${150 - (progress * 150)}px)`,
              }}
            >
              <h2 className="text-5xl font-black text-gray-900 dark:text-white">Neden Biz?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">Veteriner onaylı bilgilerin, tecrübeli hayvan sahiplerinin ve sınırsız pati sevgisinin buluştuğu nokta.</p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"><div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xl">✓</div><div><h4 className="font-bold text-gray-900 dark:text-white text-lg">Güvenilir Bilgi</h4><p className="text-sm text-gray-500">Hurafelerden uzak.</p></div></div>
                <div className="flex items-center gap-4 bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"><div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">∞</div><div><h4 className="font-bold text-gray-900 dark:text-white text-lg">Sınırsız Destek</h4><p className="text-sm text-gray-500">7/24 aktif topluluk.</p></div></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- Sayfanın Geri Kalanı (Faydalı Bilgiler Görseli Eklendi) --- */}
      <div className="max-w-6xl mx-auto px-4 pb-20 relative z-10 bg-background-light dark:bg-background-dark">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-gray-200 dark:border-gray-800 py-12 mb-24 mt-10">
          <div className="text-center flex flex-col items-center gap-2"><span className="material-symbols-outlined text-4xl text-primary">favorite</span><p className="text-lg font-bold text-gray-900 dark:text-white">Sevgi Dolu</p></div>
          <div className="text-center flex flex-col items-center gap-2"><span className="material-symbols-outlined text-4xl text-primary">school</span><p className="text-lg font-bold text-gray-900 dark:text-white">Bilgi Dolu</p></div>
          <div className="text-center flex flex-col items-center gap-2"><span className="material-symbols-outlined text-4xl text-primary">pets</span><p className="text-lg font-bold text-gray-900 dark:text-white">Dost Canlısı</p></div>
          <div className="text-center flex flex-col items-center gap-2"><span className="material-symbols-outlined text-4xl text-primary">lock_open</span><p className="text-lg font-bold text-gray-900 dark:text-white">Ücretsiz</p></div>
        </div>

        <section>
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div><h3 className="text-3xl font-bold text-gray-900 dark:text-white">Keşfetmeye Başla</h3><p className="text-gray-600 dark:text-gray-400 mt-2">Sadece bir forum değil, tam bir yaşam alanı.</p></div>
            <Link to="/forum" className="text-primary font-bold hover:underline flex items-center gap-1">Tümünü Gör <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* DÜZELTME: Faydalı Bilgiler için yeni görsel linki eklendi */}
            <div className="group bg-white dark:bg-[#2a2015] rounded-3xl p-3 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 rounded-2xl bg-gray-200 bg-cover bg-center overflow-hidden relative"><div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div><div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?q=80&w=800&auto=format&fit=crop)' }}></div></div>
              <div className="p-6"><h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Faydalı Bilgiler</h4><p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Veteriner onaylı makaleler.</p></div>
            </div>
            <div className="group bg-white dark:bg-[#2a2015] rounded-3xl p-3 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 rounded-2xl bg-gray-200 bg-cover bg-center overflow-hidden relative"><div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800)' }}></div></div>
              <div className="p-6"><h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Topluluk Forumu</h4><p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Diğer sahiplerle tanış.</p></div>
            </div>
            <div className="group bg-white dark:bg-[#2a2015] rounded-3xl p-3 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 rounded-2xl bg-gray-200 bg-cover bg-center overflow-hidden relative"><div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=800)' }}></div></div>
              <div className="p-6"><h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Eğitim Akademisi</h4><p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Sıfırdan ileri seviyeye.</p></div>
            </div>
          </div>
        </section>

        <div className="mt-24 mb-10 bg-primary rounded-[2.5rem] p-8 sm:p-16 relative overflow-hidden shadow-2xl shadow-orange-500/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/5 rounded-full blur-3xl -ml-10 -mb-10"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="text-white max-w-xl"><h3 className="text-3xl sm:text-4xl font-black mb-4">Aramıza Katılmaya Ne Dersin?</h3><p className="text-orange-100 text-lg font-medium">Hemen ücretsiz üye ol.</p></div>
            <Link to="/giris"><button className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-xl">Hemen Kayıt Ol</button></Link>
          </div>
        </div>

      </div>
    </main>
  );
}