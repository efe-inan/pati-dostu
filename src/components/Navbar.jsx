import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

export default function Navbar({ tema, temaDegistir }) {
  const [user, setUser] = useState(null);
  const [menuAcik, setMenuAcik] = useState(false); // Mobil menü durumu
  const [aramaMetni, setAramaMetni] = useState("");
  const location = useLocation(); // Sayfa değişince menüyü kapatmak için

  const ADMIN_EMAIL = "efe_nbhd@outlook.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  // Sayfa değişirse mobil menüyü kapat
  useEffect(() => {
    setMenuAcik(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#1a1a1a]/90 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-10">
        <div className="flex items-center justify-between h-16">
          
          {/* --- LOGO --- */}
          <div className="flex items-center gap-3 text-primary shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/logo.png" alt="PatiDostu" className="h-10 w-auto object-contain transition-transform group-hover:scale-110" />
              <span className="text-gray-900 dark:text-white text-xl font-bold tracking-tight">PatiDostu</span>
            </Link>
          </div>

          {/* --- MASAÜSTÜ MENÜ (MD ve Üstü) --- */}
          <div className="hidden md:flex items-center flex-1 justify-end gap-6 mr-6">
            <div className="relative group w-full max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input type="text" placeholder="Ara..." className="w-full bg-gray-100 dark:bg-white/5 border-transparent focus:border-orange-500 focus:bg-white dark:focus:bg-black/20 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none transition-all dark:text-white" />
            </div>
            <nav className="flex gap-6">
              <Link to="/" className="text-gray-700 dark:text-gray-200 text-sm font-bold hover:text-orange-500 transition-colors">Ana Sayfa</Link>
              <Link to="/forum" className="text-gray-700 dark:text-gray-200 text-sm font-bold hover:text-orange-500 transition-colors">Forum</Link>
              <Link to="/egitim" className="text-gray-700 dark:text-gray-200 text-sm font-bold hover:text-orange-500 transition-colors">Eğitim</Link>
            </nav>
          </div>

          {/* --- SAĞ KISIM (Masaüstü) --- */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={temaDegistir} className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-yellow-300 hover:bg-gray-200 transition-colors">
              <span className="material-symbols-outlined text-xl block">{tema === 'light' ? 'dark_mode' : 'light_mode'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {user.email === ADMIN_EMAIL && (
                  <Link to="/admin" className="bg-black dark:bg-white dark:text-black text-white px-3 py-1.5 rounded-full text-xs font-bold hover:opacity-80 transition-opacity">Panel</Link>
                )}
                <Link to="/profil" className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-orange-500 transition-colors bg-gray-50 dark:bg-white/10 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="Avatar" className="w-6 h-6 rounded-full object-cover"/>
                  <span className="max-w-[100px] truncate">{user.displayName || "Hesabım"}</span>
                </Link>
                <button onClick={() => auth.signOut()} className="bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-red-100 transition-colors">Çıkış</button>
              </div>
            ) : (
              <Link to="/giris"><button className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors shadow-md">Giriş Yap</button></Link>
            )}
          </div>

          {/* --- MOBİL MENÜ BUTONU (Sadece Telefondan Görünür) --- */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={temaDegistir} className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-yellow-300">
              <span className="material-symbols-outlined text-xl block">{tema === 'light' ? 'dark_mode' : 'light_mode'}</span>
            </button>
            <button onClick={() => setMenuAcik(!menuAcik)} className="text-gray-700 dark:text-white p-1">
              <span className="material-symbols-outlined text-3xl">{menuAcik ? 'close' : 'menu'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* --- MOBİL AÇILIR MENÜ --- */}
      {menuAcik && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-gray-800 shadow-xl py-4 px-4 flex flex-col gap-4 animate-fadeIn">
          
          {/* Mobil Arama */}
          <div className="relative group w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </span>
            <input type="text" placeholder="Ara..." className="w-full bg-gray-100 dark:bg-white/5 border-transparent rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none dark:text-white" />
          </div>

          <nav className="flex flex-col gap-2">
            <Link to="/" className="p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 font-bold flex items-center gap-3">
              <span className="material-symbols-outlined">home</span> Ana Sayfa
            </Link>
            <Link to="/forum" className="p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 font-bold flex items-center gap-3">
              <span className="material-symbols-outlined">forum</span> Forum
            </Link>
            <Link to="/egitim" className="p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 font-bold flex items-center gap-3">
              <span className="material-symbols-outlined">school</span> Eğitim
            </Link>
          </nav>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <Link to="/profil" className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800">
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="Avatar" className="w-10 h-10 rounded-full object-cover"/>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{user.displayName || "Hesabım"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </Link>
                {user.email === ADMIN_EMAIL && (
                  <Link to="/admin" className="text-center w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm">Admin Paneli</Link>
                )}
                <button onClick={() => auth.signOut()} className="w-full py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm">Çıkış Yap</button>
              </div>
            ) : (
              <Link to="/giris">
                <button className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold text-lg shadow-md">Giriş Yap</button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}