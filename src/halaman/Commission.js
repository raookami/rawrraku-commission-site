import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Commission({ isDark, theme }) {
  const navigate = useNavigate();
  const [commissions, setCommissions] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComm, setSelectedComm] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [{ data: commData }, { data: addonData }] = await Promise.all([
        supabase
          .from('commission_types')
          .select('*, commission_variants(*)')
          .order('sort_order'),
        supabase.from('addons').select('*').order('sort_order'),
      ]);
      setCommissions(commData || []);
      setAddons(addonData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  function formatAddonLabel(addon) {
    if (addon.type === 'percent') return `+${addon.value_num}% per karakter`;
    if (addon.type === 'range') return `+Rp ${Number(addon.value_min).toLocaleString('id-ID')} – ${Number(addon.value_max).toLocaleString('id-ID')}`;
    if (addon.type === 'multiplier') return `×${addon.value_num} total harga`;
    if (addon.type === 'fixed') return `+Rp ${Number(addon.value_num).toLocaleString('id-ID')}`;
    return '';
  }

  if (loading) {
    return (
      <div className="page-enter" style={{ ...theme.page, textAlign: 'center', paddingTop: 60 }}>
        <div style={{ color: '#aaa' }}>Memuat...</div>
      </div>
    );
  }

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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {(c.commission_variants || []).map((v) => (
                  <button
                    key={v.id}
                    style={theme.btnVariant}
                    onClick={() => {
                      navigate(`/order?type=${encodeURIComponent(`${c.type} — ${v.label}`)}`);
                      setSelectedComm(null);
                    }}
                  >
                    <strong>{v.label}</strong>
                    <span style={{ fontSize: 12, color: '#a06080' }}>
                      {' '}· Rp {Number(v.price).toLocaleString('id-ID')}
                    </span>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{v.description}</div>
                  </button>
                ))}
                <button
                  style={{ ...theme.btnSecondary, fontSize: 13, padding: '6px 12px' }}
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

      {/* ADD-ONS dari Supabase */}
      {addons.length > 0 && (
        <div style={theme.tos}>
          <h3 style={theme.tosTitle}>✨ Add-ons</h3>
          <ul style={theme.tosList}>
            {addons.map((addon) => (
              <li key={addon.id}>
                <strong>{addon.label}</strong>
                <span style={{ color: '#888', marginLeft: 6 }}>
                  — {formatAddonLabel(addon)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TOS — tetap statis */}
      <div style={theme.tos}>
        <h3 style={theme.tosTitle}>📋 Terms of Service</h3>
        <ul style={theme.tosList}>
          <li>Payment after sketch approval.</li>
          <li>No refunds after payment is made.</li>
          <li>Turnaround time: 7–14 days (depends on queue). DON'T RUSH PLEASE</li>
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
