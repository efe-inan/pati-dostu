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
            <div className="text-white max-w-xl"><h3 className="text-3xl sm:text-4xl font-black mb-4">Aramıza Katılmaya Ne Dersin?</h3><p className="text-orange-100 text-lg font-medium">Hemen ücretsiz üye ol.</p></div>
            <Link to="/giris"><button className="bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all shadow-xl">Hemen Kayıt Ol</button></Link>
          </div >
        </div >

      </div >
    </main >
  );
}