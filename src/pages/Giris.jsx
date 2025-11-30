import { useState } from "react";
import { auth, db } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  sendEmailVerification 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'; // Bildirimler için
import LoadingOverlay from '../components/LoadingOverlay'; // Yeni Yükleme Ekranı

export default function Giris() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [yeniUyeMi, setYeniUyeMi] = useState(false); 
  const [yukleniyor, setYukleniyor] = useState(false); // Yükleme durumu
  const [yuklemeMesaji, setYuklemeMesaji] = useState(""); // Ekranda yazacak yazı
  const navigate = useNavigate();

  const islemYap = async (e) => {
    e.preventDefault();
    setYukleniyor(true); // Yüklemeyi başlat

    try {
      if (yeniUyeMi) {
        setYuklemeMesaji("Hesabın oluşturuluyor...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, sifre);
        const user = userCredential.user;
        
        setYuklemeMesaji("Bilgilerin kaydediliyor...");
        await setDoc(doc(db, "kullanicilar", user.uid), {
          email: user.email,
          kayitTarihi: new Date(),
          petAdi: "",
          role: "uye"
        });

        setYuklemeMesaji("Doğrulama maili gönderiliyor...");
        await sendEmailVerification(user);
        
        toast.success("Kayıt başarılı! Doğrulama linkini e-postana gönderdik.", { duration: 5000 });
      } else {
        setYuklemeMesaji("Giriş yapılıyor...");
        await signInWithEmailAndPassword(auth, email, sifre);
        toast.success("Tekrar Hoş Geldin! 👋");
      }
      
      // Biraz bekletip yönlendirelim ki kullanıcı mesajı görsün
      setTimeout(() => {
        setYukleniyor(false);
        navigate("/"); 
      }, 1000);

    } catch (error) {
      setYukleniyor(false);
      // Hata mesajlarını Türkçeleştirelim
      let hataMesaji = "Bir hata oluştu.";
      if (error.code === "auth/invalid-credential") hataMesaji = "E-posta veya şifre hatalı.";
      if (error.code === "auth/email-already-in-use") hataMesaji = "Bu e-posta zaten kullanılıyor.";
      if (error.code === "auth/weak-password") hataMesaji = "Şifre çok zayıf (en az 6 karakter).";
      
      toast.error(hataMesaji);
    }
  };

  const sifreSifirla = async () => {
    if (!email) return toast.error("Lütfen e-posta adresini yaz.");
    setYukleniyor(true);
    setYuklemeMesaji("Sıfırlama bağlantısı hazırlanıyor...");
    
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Sıfırlama bağlantısı gönderildi! Spam kutunu kontrol et.");
    } catch (error) {
      toast.error("Hata: " + error.message);
    }
    setYukleniyor(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark font-display transition-colors duration-300">
      
      {/* YÜKLEME EKRANI (Bulanık Arka Plan) */}
      <LoadingOverlay yukleniyor={yukleniyor} mesaj={yuklemeMesaji} />

      <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
        <div className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2015] p-8 shadow-sm">
          <div className="flex flex-col items-center space-y-6">
            
            <div className="flex items-center gap-2 text-primary">
              <img src="/logo.png" alt="PatiDostu Logo" className="h-12 w-auto object-contain" />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">PatiDostu</span>
            </div>
            
            <div className="text-center">
              <h1 className="text-[#181511] dark:text-white tracking-tight text-[32px] font-bold leading-tight">
                {yeniUyeMi ? "Aramıza Katıl!" : "Hoş Geldin!"}
              </h1>
              <p className="text-[#8a7960] dark:text-gray-400 text-base font-normal leading-normal pt-1">
                {yeniUyeMi ? "Hemen ücretsiz hesabını oluştur" : "PatiDostu topluluğuna giriş yap"}
              </p>
            </div>

            <form onSubmit={islemYap} className="w-full space-y-4">
              <div className="relative flex flex-col">
                <label className="text-gray-900 dark:text-gray-300 text-base font-medium leading-normal pb-2">E-posta Adresi</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
                  <input required type="email" placeholder="E-posta adresinizi girin" className="flex w-full rounded-lg border border-[#e6e1db] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#181511] dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 h-14 pl-12 pr-4" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
              </div>

              <div className="relative flex flex-col">
                <label className="text-gray-900 dark:text-gray-300 text-base font-medium leading-normal pb-2">Şifre</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
                  <input required type="password" placeholder="Şifrenizi girin" className="flex w-full rounded-lg border border-[#e6e1db] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#181511] dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 h-14 pl-12 pr-4" value={sifre} onChange={(e) => setSifre(e.target.value)}/>
                </div>
              </div>

              {!yeniUyeMi && (
                <div className="text-right">
                  <button type="button" onClick={sifreSifirla} className="text-blue-500 hover:text-blue-600 text-sm font-medium underline cursor-pointer">Şifremi Unuttum?</button>
                </div>
              )}

              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 h-14 text-white text-base font-bold shadow-sm hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                {yeniUyeMi ? "Kayıt Ol" : "Giriş Yap"}
              </button>
            </form>

            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">
                {yeniUyeMi ? "Zaten hesabın var mı? " : "Hesabın yok mu? "}
                <button type="button" onClick={() => setYeniUyeMi(!yeniUyeMi)} className="font-bold text-orange-500 hover:underline cursor-pointer">{yeniUyeMi ? "Giriş Yap" : "Hemen Kayıt Ol"}</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}