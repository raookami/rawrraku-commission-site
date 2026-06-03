import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './useTheme';
import { getTheme } from './themes';

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

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const theme = getTheme(isDark);

  const [visitorName, setVisitorName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('visitor_name');
    const savedAdmin = localStorage.getItem('is_admin') === 'true';
    if (savedName) {
      setVisitorName(savedName);
      setIsAdmin(savedAdmin);
    } else {
      setShowModal(true);
    }
  }, []);

  function handleEnter(name, adminStatus) {
    setVisitorName(name);
    setIsAdmin(adminStatus);
    setShowModal(false);
  }

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
