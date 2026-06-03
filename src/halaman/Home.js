import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatusStyle } from '../themes';
import ReviewMarquee from '../komponen/ReviewMarquee';
import { supabase } from '../supabase';

export default function Home({ isDark, theme, isAdmin }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      const { data } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'commission_open')
        .single();
      if (data) setIsOpen(data.value === 'true');
    }
    fetchStatus();
  }, []);

  return (
    <div className="page-enter">
      <ReviewMarquee
        isDark={isDark}
        onClickReviews={() => navigate('/reviews')}
      />

      <div style={theme.page}>
        {/* Hero */}
        <div style={theme.hero}>
          <img
            src="/lv_0_20250116221257.gif"
            alt="Raooraku"
            style={{
              width: 100,
              height: 100,
              borderRadius: '100%',
              objectFit: 'cover',
            }}
          />
          <h2 style={theme.heroTitle}>HI! I'M RAOORAKU ✨</h2>
          <p style={theme.heroDesc}>
            specialize in cute male character design.
          </p>
          <div style={theme.heroButtons}>
            <button
              style={theme.btnPrimary}
              onClick={() => navigate('/commission')}
            >
              IDR COMMISSION
            </button>
            <button
              style={theme.btnSecondary}
              onClick={() => navigate('/portfolio')}
            >
              PORTFOLIO
            </button>
            <button
              style={theme.btnSecondary}
              onClick={() => window.open('https://vgen.co/raooraku_', '_blank')}
            >
              USD COMMISSION ↗
            </button>
          </div>
        </div>

        {/* Status commission */}
        <div
          style={{
            ...theme.statusBox,
            ...getStatusStyle(isOpen, isDark),
            color: isOpen ? '#5ed15e' : '#ca5b5b',
          }}
        >
          <span
            style={{
              ...theme.statusDot,
              background: isOpen ? '#0c0' : '#e00',
            }}
          />
          <strong>{isOpen ? 'COMMISSION OPEN' : 'COMMISSION CLOSED'}</strong>
          <button
            onClick={async () => {
              if (!isAdmin) return;
              const newStatus = !isOpen;
              setIsOpen(newStatus);
              await supabase
                .from('settings')
                .update({ value: String(newStatus) })
                .eq('key', 'commission_open');
            }}
            style={{
              marginLeft: 'auto',
              padding: '4px 14px',
              borderRadius: 999,
              border: 'none',
              background: isAdmin ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : 'transparent',
              cursor: isAdmin ? 'pointer' : 'default',
              fontSize: 12,
              color: isAdmin ? (isDark ? '#ccc' : '#555') : 'transparent',
            }}
          >
            {isAdmin ? (isOpen ? 'Tutup' : 'Buka') : ''}
          </button>
        </div>

        {/* Info singkat */}
        <div style={theme.infoGrid}>
          {[
            { icon: '⏱️', label: 'Estimasi', value: '7–14 hari kerja' },
            {
              icon: '💳',
              label: 'Pembayaran',
              value: 'Transfer Bank / E-WALLET',
            },
            { icon: '🔄', label: 'Revisi', value: '2x revisi minor' },
            { icon: '📩', label: 'Format', value: 'PNG / JPG 300dpi' },
          ].map((info) => (
            <div key={info.label} style={theme.infoCard}>
              <div style={theme.infoIcon}>{info.icon}</div>
              <div style={theme.infoLabel}>{info.label}</div>
              <div style={theme.infoValue}>{info.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
