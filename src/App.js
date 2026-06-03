import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './useTheme';
import { getTheme } from './themes';

import Navbar from './komponen/Navbar';
import Footer from './komponen/Footer';

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

  return (
    <BrowserRouter>
      <div style={theme.app}>
        <Navbar isDark={isDark} toggleTheme={toggleTheme} theme={theme} />

        <main style={theme.main}>
          <Routes>
            <Route path="/" element={<Home isDark={isDark} theme={theme} />} />
            <Route
              path="/portfolio"
              element={<Portfolio isDark={isDark} theme={theme} />}
            />
            <Route
              path="/commission"
              element={<Commission isDark={isDark} theme={theme} />}
            />
            <Route
              path="/order"
              element={<Order isDark={isDark} theme={theme} />}
            />
            <Route
              path="/ulasan"
              element={<Ulasan isDark={isDark} theme={theme} />}
            />
            <Route
              path="/reviews"
              element={<Reviews isDark={isDark} theme={theme} />}
            />
            <Route
              path="/admin"
              element={<Admin isDark={isDark} theme={theme} />}
            />
          </Routes>
        </main>

        <Footer theme={theme} />
      </div>
    </BrowserRouter>
  );
}
