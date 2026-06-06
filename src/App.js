import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './useTheme';
import { getTheme } from './themes';
import { supabase } from './supabase';

import Navbar from './komponen/Navbar';
import Footer from './komponen/Footer';
import WelcomeModal from './komponen/WelcomeModal';

import Home from './halaman/Home';
import Portfolio from './halaman/Portfolio';
import Commission from './halaman/Commission';
import Order from './halaman/Order';
import Ulasan from './halaman/Ulasan';
import Reviews from './halaman/Reviews';
import Admin from './halaman/Admin';

function AppInner({ isDark, toggleTheme, theme }) {
  const [visitorName, setVisitorName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Cek apakah ada Supabase session aktif (untuk admin yang sudah login)
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      const savedName = localStorage.getItem('visitor_name');

      if (session && savedName) {
        // Ada session Supabase yang valid → ini admin
        setVisitorName(savedName);
        setIsAdmin(true);
      } else if (savedName && !session) {
        // Ada nama tapi tidak ada session → visitor biasa
        setVisitorName(savedName);
        setIsAdmin(false);
      } else {
        // Belum pernah masuk → tampilkan modal
        setShowModal(true);
      }
      setAuthChecked(true);
    }

    checkSession();

    // Listen perubahan auth (kalau session expired dll)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          // Session habis / logout → reset admin status
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  function handleEnter(name, adminStatus, _session) {
    setVisitorName(name);
    setIsAdmin(adminStatus);
    setShowModal(false);
  }

  // Tunggu pengecekan auth selesai dulu
  if (!authChecked) return null;

  return (
    <div style={theme.app}>
        {showModal && (
          <WelcomeModal
            theme={theme}
            isDark={isDark}
            onEnter={handleEnter}
          />
        )}

        <Navbar
          isDark={isDark}
          toggleTheme={toggleTheme}
          theme={theme}
          isAdmin={isAdmin}
          visitorName={visitorName}
        />

        <main style={theme.main}>
          <Routes>
            <Route path="/" element={<Home isDark={isDark} theme={theme} isAdmin={isAdmin} />} />
            <Route path="/portfolio" element={<Portfolio isDark={isDark} theme={theme} />} />
            <Route path="/commission" element={<Commission isDark={isDark} theme={theme} />} />
            <Route path="/order" element={<Order isDark={isDark} theme={theme} visitorName={visitorName} />} />
            <Route path="/ulasan" element={<Ulasan isDark={isDark} theme={theme} visitorName={visitorName} />} />
            <Route path="/reviews" element={<Reviews isDark={isDark} theme={theme} />} />
            <Route path="/admin" element={<Admin isDark={isDark} theme={theme} isAdmin={isAdmin} />} />
          </Routes>
        </main>

        <Footer theme={theme} />
      </div>
  );
}

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const theme = getTheme(isDark);
  return (
    <BrowserRouter>
      <AppInner isDark={isDark} toggleTheme={toggleTheme} theme={theme} />
    </BrowserRouter>
  );
}