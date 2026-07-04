import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Commission() {
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
    if (addon.type === 'percent')    return `+${addon.value_num}% per karakter`;
    if (addon.type === 'range')      return `+Rp ${Number(addon.value_min).toLocaleString('id-ID')} – ${Number(addon.value_max).toLocaleString('id-ID')}`;
    if (addon.type === 'multiplier') return `×${addon.value_num} total harga`;
    if (addon.type === 'fixed')      return `+Rp ${Number(addon.value_num).toLocaleString('id-ID')}`;
    return '';
  }

  if (loading) {
    return (
      <div className="page-enter" style={{ textAlign: 'center', paddingTop: 60, color: '#aaa' }}>
        Memuat...
      </div>
    );
  }

  return (
    <div className="page-enter comm-page">

      <h2 className="section-title">RAWRMISSION</h2>
      <p className="section-desc">
        Original character, personal use, commercial use, profile picture,
        banner, gift for friends, etc.
      </p>
      <p className="section-desc">
        Pilih jenis commission yang kamu mau, lalu lanjut ke halaman Order!
      </p>

      {/* Grid commission types */}
      <div className="comm-grid">
        {commissions.map((c) => (
          <div key={c.id} className="comm-card">
            <div className="comm-emoji">{c.emoji}</div>
            <h3 className="comm-type">{c.type}</h3>
            <div className="comm-slots">
              Slot tersisa:{' '}
              <strong style={{ color: c.slots <= 1 ? '#e05' : '#4caf50' }}>
                {c.slots}
              </strong>
            </div>

            {selectedComm === c.id ? (
              <div className="comm-variants">
                {(c.commission_variants || []).map((v) => (
                  <button
                    key={v.id}
                    className="btn-variant"
                    onClick={() => {
                      navigate(`/order?type=${encodeURIComponent(`${c.type} — ${v.label}`)}`);
                      setSelectedComm(null);
                    }}
                  >
                    <strong>{v.label}</strong>
                    <span className="variant-price">
                      {' '}· Rp {Number(v.price).toLocaleString('id-ID')}
                    </span>
                    <div className="variant-desc">{v.description}</div>
                  </button>
                ))}
                <button
                  className="btn-secondary btn-sm"
                  onClick={() => setSelectedComm(null)}
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                className={c.slots > 0 ? 'btn-primary' : 'btn-disabled'}
                disabled={c.slots === 0}
                onClick={() => setSelectedComm(c.id)}
              >
                {c.slots > 0 ? 'Pilih Commission' : 'Slot Penuh'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add-ons */}
      {addons.length > 0 && (
        <div className="tos-box">
          <h3 className="tos-title">✨ Add-ons</h3>
          <ul className="tos-list">
            {addons.map((addon) => (
              <li key={addon.id}>
                <strong>{addon.label}</strong>
                <span className="addon-label"> — {formatAddonLabel(addon)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Terms of Service */}
      <div className="tos-box">
        <h3 className="tos-title">📋 Terms of Service</h3>
        <ul className="tos-list">
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
