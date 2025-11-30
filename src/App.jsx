import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// TÜM SAYFALARI İÇERİ ALIYORUZ
import Home from "./pages/Home";
import Forum from "./pages/Forum";
import ForumDetay from "./pages/ForumDetay"; // Forum Detay
import Egitim from "./pages/Egitim";
import EgitimDetay from "./pages/EgitimDetay";
import Giris from "./pages/Giris";
import Profil from "./pages/Profil";
import Admin from "./pages/Admin";
import Arama from "./pages/Arama";
import NotFound from "./pages/NotFound";
import Hakkimizda from "./pages/Hakkimizda"; 
import Iletisim from "./pages/Iletisim";
import KullaniciProfil from "./pages/KullaniciProfil";
import Favorilerim from "./pages/Favorilerim";

function App() {
  const [tema, setTema] = useState("light");

  useEffect(() => {
    if (tema === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [tema]);

  const temaDegistir = () => {
    setTema(tema === "light" ? "dark" : "light");
  };

  return (
    <Router>
      <div className="min-h-screen w-full bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-display transition-colors duration-300">
        
        <Navbar tema={tema} temaDegistir={temaDegistir} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumDetay />} />
          
          <Route path="/egitim" element={<Egitim />} />
          <Route path="/egitim/:id" element={<EgitimDetay />} />
          
          <Route path="/giris" element={<Giris />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/kullanici/:uid" element={<KullaniciProfil />} />
          
          {/* ARAMA ROTASI BURADA 👇 */}
          <Route path="/arama" element={<Arama />} />

          <Route path="*" element={<NotFound />} />
          <Route path="/hakkimizda" element={<Hakkimizda />} />
          <Route path="/iletisim" element={<Iletisim />} />
{/* "kullanim-kosullari" ve "gizlilik" için şimdilik Hakkimizda sayfasını kullanabiliriz veya boş bırakabiliriz */}
          <Route path="/kullanim-kosullari" element={<Hakkimizda />} />
          <Route path="/gizlilik" element={<Hakkimizda />} />
          <Route path="/favoriler" element={<Favorilerim />} />
        </Routes>
        
        <Footer />
        <Toaster />
        
      </div>
    </Router>
  );
}

export default App;