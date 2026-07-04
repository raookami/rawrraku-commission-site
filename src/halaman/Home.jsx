import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewMarquee from '../komponen/ReviewMarquee';
import PortfolioMarquee from '../komponen/PortfolioMarquee';
import { supabase } from '../supabase';

const judul          = 'RAWRMISSION';
const subjudul       = 'Cute Boy Character Illustration & Design';
const deskripsi      = 'Hai! Saya Raooraku, illustrator dan character designer yang fokus membuat karakter anime cowok yang cute — cocok untuk koleksi pribadi, profil, banner, hingga hadiah untuk teman. Yuk, wujudkan karakter impianmu!';

export default function Home({ visitorName }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [info, setInfo] = useState({
    info_estimasi:   '7–14 hari kerja',
    info_pembayaran: 'Transfer Bank / E-WALLET',
    info_revisi:     '2x revisi minor',
    info_format:     'PNG / JPG 300dpi',
  });

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('key, value');
      if (data && data.length > 0) {
        const map = {};
        data.forEach((s) => { map[s.key] = s.value; });
        setInfo((prev) => ({ ...prev, ...map }));
        if (map.commission_open !== undefined) {
          setIsOpen(map.commission_open === 'true');
        }
      }
    }
    fetchSettings();
  }, []);

  return (
    <div>
      {/* Sambutan */}
      <div className="sambutan">
        <h1>Hii, {visitorName}!</h1>
        <h1>Siap mengubah karaktermu jadi ilustrasi?</h1>
      </div>

      {/* Review marquee */}
      <ReviewMarquee onClickReviews={() => navigate('/reviews')} />

      {/* Card pengenal */}
      <div className="kartu-pengenal">
        <img src="/Animation5transparents.gif" alt={judul} />
        <h4>{judul}</h4>
        <h5>{subjudul}</h5>
        <p>{deskripsi}</p>

        <div className="portfolio-marquee-wrapper">
          <PortfolioMarquee onClickPortfolio={() => navigate('/portfolio')} />
        </div>
      </div>

      {/* Tombol aksi */}
      <div className="hero-buttons">
        <button className="btn-primary" onClick={() => navigate('/commission')}>
          IDR COMMISSION
        </button>
        <button className="btn-secondary" onClick={() => navigate('/portfolio')}>
          PORTFOLIO
        </button>
        <button className="btn-secondary" onClick={() => window.open('https://vgen.co/raooraku_', '_blank')}>
          USD COMMISSION ↗
        </button>
      </div>

      {/* Status commission */}
      <div className={`status-box ${isOpen ? 'status-open' : 'status-closed'}`}>
        <span className="status-dot" />
        <strong>{isOpen ? 'COMMISSION OPEN' : 'COMMISSION CLOSED'}</strong>
      </div>

      {/* Info grid */}
      <div className="info-grid">
        {[
          { icon: '⏱️', label: 'Estimasi',   value: info.info_estimasi },
          { icon: '💳', label: 'Pembayaran', value: info.info_pembayaran },
          { icon: '🔄', label: 'Revisi',     value: info.info_revisi },
          { icon: '📩', label: 'Format',     value: info.info_format },
        ].map((item) => (
          <div key={item.label} className="info-card">
            <div className="info-icon">{item.icon}</div>
            <div className="info-label">{item.label}</div>
            <div className="info-value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
