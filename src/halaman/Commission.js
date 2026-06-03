import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const commissions = [
  {
    id: 1,
    type: 'Bust Up',
    emoji: '🎨',
    variant: [
      {
        label: 'Simple BG',
        price: 100000,
        desc: 'Gambar karakter dengan background sederhana.',
      },
      {
        label: 'Normal BG',
        price: 130000,
        desc: 'Gambar karakter dengan normal background.',
      },
    ],
    slots: 5,
  },
  {
    id: 2,
    type: 'Half Body',
    emoji: '🐻‍❄️',
    variant: [
      {
        label: 'Simple BG',
        price: 200000,
        desc: 'Gambar karakter dengan background sederhana.',
      },
      {
        label: 'Normal BG',
        price: 250000,
        desc: 'Gambar karakter dengan normal background.',
      },
    ],
    slots: 3,
  },
  {
    id: 3,
    type: 'Full Body',
    emoji: '✨',
    variant: [
      {
        label: 'Simple BG',
        price: 300000,
        desc: 'Gambar karakter dengan background sederhana.',
      },
      {
        label: 'Normal BG',
        price: 380000,
        desc: 'Gambar karakter dengan normal background.',
      },
    ],
    slots: 2,
  },
];

export default function Commission({ isDark, theme }) {
  const navigate = useNavigate();
  const [selectedComm, setSelectedComm] = useState(null);

  return (
    <div className="page-enter" style={theme.page}>
      <h2 style={theme.sectionTitle}>RAWRMISSION</h2>
      <h3 style={theme.sectionDesc}>
        Original character, personal use, commercial use, profile picture,
        banner, gift for friends, etc.
      </h3>
      <p style={theme.sectionDesc}>
        Pilih jenis commission yang kamu mau, lalu lanjut ke halaman Order!
      </p>

      <div style={theme.commissionGrid}>
        {commissions.map((c) => (
          <div key={c.id} style={theme.commCard}>
            <div style={theme.commEmoji}>{c.emoji}</div>
            <h3 style={theme.commType}>{c.type}</h3>
            <div style={theme.commSlots}>
              Slot tersisa:{' '}
              <strong style={{ color: c.slots <= 1 ? '#e05' : '#0a7' }}>
                {c.slots}
              </strong>
            </div>

            {selectedComm === c.id ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  marginTop: 8,
                }}
              >
                {c.variant.map((v) => (
                  <button
                    key={v.label}
                    style={theme.btnVariant}
                    onClick={() => {
                      // Kirim data ke Order via URL query
                      navigate(
                        `/order?type=${encodeURIComponent(`${c.type} — ${v.label}`)}`,
                      );
                      setSelectedComm(null);
                    }}
                  >
                    <strong>{v.label}</strong>
                    <span style={{ fontSize: 12, color: '#a06080' }}>
                      {' '}
                      · Rp {v.price.toLocaleString('id-ID')}
                    </span>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                      {v.desc}
                    </div>
                  </button>
                ))}
                <button
                  style={{
                    ...theme.btnSecondary,
                    fontSize: 13,
                    padding: '6px 12px',
                  }}
                  onClick={() => setSelectedComm(null)}
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                style={c.slots > 0 ? theme.btnPrimary : theme.btnDisabled}
                disabled={c.slots === 0}
                onClick={() => setSelectedComm(c.id)}
              >
                {c.slots > 0 ? 'Pilih Commission' : 'Slot Penuh'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ADD-ONS */}
      <div style={theme.tos}>
        <h3 style={theme.tosTitle}>✨ Add-ons</h3>
        <ul style={theme.tosList}>
          <li>
            <strong>Extra character</strong> — +50% per karakter
          </li>
          <li>
            <strong>Detailed BG</strong> — +Rp 50.000 – 100.000
          </li>
          <li>
            <strong>Commercial use</strong> — 2× total harga
          </li>
          <li>
            <strong>Character Design</strong> — Rp 500.000 – 1.000.000
            <ul style={{ marginTop: 4 }}>
              <li>
                <em>Basic</em> — 1 fullbody pose, final colour
              </li>
              <li>
                <em>Full</em> — 1 fullbody pose, outfit details, color palette
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* TOS */}
      <div style={theme.tos}>
        <h3 style={theme.tosTitle}>📋 Terms of Service</h3>
        <ul style={theme.tosList}>
          <li>Payment after sketch approval.</li>
          <li>No refunds after payment is made.</li>
          <li>
            Turnaround time: 7–14 days (depends on queue). DON'T RUSH PLEASE
          </li>
          <li>2x minor revision (small color / expression).</li>
          <li>I may decline a commission if I'm unable to take it.</li>
          <li>Will not draw: NSFW, 18+, fetish, heavy gore, complex mecha.</li>
          <li>Personal use only (commercial use available with extra fee).</li>
          <li>Credit me when reposting.</li>
          <li>NFT & AI training are not allowed.</li>
          <li>I may post the artwork as portfolio.</li>
        </ul>
      </div>
    </div>
  );
}
