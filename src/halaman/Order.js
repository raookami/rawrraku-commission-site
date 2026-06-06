import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Order({ isDark, theme, visitorName }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [commissions, setCommissions] = useState([]);
  const [addons, setAddons] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    name: visitorName || '',
    contact: '',
    email: '',
    type: searchParams.get('type') || '',
    desc: '',
    ref: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [{ data: commData }, { data: addonData }] = await Promise.all([
        supabase.from('commission_types').select('*, commission_variants(*)').order('sort_order'),
        supabase.from('addons').select('*').order('sort_order'),
      ]);
      setCommissions(commData || []);
      setAddons(addonData || []);
      setLoadingData(false);
    }
    fetchData();
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function hitungEstimasi() {
    const allVariants = commissions.flatMap((c) =>
      (c.commission_variants || []).map((v) => ({ ...v, typeName: c.type }))
    );
    const selected = allVariants.find(
      (v) => `${v.typeName} — ${v.label}` === formData.type
    );
    if (!selected) return null;

    let minTotal = Number(selected.price);
    let maxTotal = Number(selected.price);

    selectedAddons.forEach((id) => {
      const addon = addons.find((a) => a.id === id);
      if (!addon) return;
      if (addon.type === 'percent') {
        const add = (minTotal * Number(addon.value_num)) / 100;
        minTotal += add; maxTotal += add;
      } else if (addon.type === 'range') {
        minTotal += Number(addon.value_min);
        maxTotal += Number(addon.value_max);
      } else if (addon.type === 'multiplier') {
        minTotal *= Number(addon.value_num);
        maxTotal *= Number(addon.value_num);
      } else if (addon.type === 'fixed') {
        minTotal += Number(addon.value_num);
        maxTotal += Number(addon.value_num);
      }
    });

    return { min: minTotal, max: maxTotal };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const selectedAddonLabels = selectedAddons
      .map((id) => addons.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    const pesan = `
🎨 **ORDER BARU!**
👤 **Nama:** ${formData.name}
📱 **Kontak Diskusi:** ${formData.contact}
📧 **Email:** ${formData.email}
🖌️ **Jenis:** ${formData.type}
✨ **Add-ons:** ${selectedAddonLabels || 'Tidak ada'}
📝 **Deskripsi:** ${formData.desc}
🔗 **Referensi:** ${formData.ref || 'Tidak ada'}
`;

    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: pesan }),
      });
      setSubmitted(true);
    } catch (err) {
      alert('Gagal mengirim order, coba lagi ya!');
    }
  }

  if (submitted) {
    return (
      <div className="page-enter" style={theme.page}>
        <div style={theme.successBox}>
          <div style={{ fontSize: 48 }}>🎉</div>
          <h3>Order berhasil dikirim!</h3>
          <p>Aku akan balas dalam 1×24 jam ya. Cek DM atau email kamu!</p>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}>
            <img src="/Animation5.gif" alt="" style={{ width: 160, height: 'auto' }} />
          </div>
          <button
            style={theme.btnPrimary}
            onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', contact: '', email: '', type: '', desc: '', ref: '' });
              navigate('/');
            }}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={theme.page}>
      <h2 style={theme.sectionTitle}>Form Order</h2>

      <form onSubmit={handleSubmit} style={theme.form}>
        <div style={theme.formGroup}>
          <label style={theme.label}>Nama / Username</label>
          <input style={theme.input} type="text" name="name" placeholder="Nama kamu..." value={formData.name} onChange={handleChange} required />
        </div>

        <div style={theme.formGroup}>
          <label style={theme.label}>Kontak Diskusi</label>
          <input style={theme.input} type="text" name="contact" placeholder="Discord / Instagram / Twitter..." value={formData.contact} onChange={handleChange} required />
        </div>

        <div style={theme.formGroup}>
          <label style={theme.label}>Email</label>
          <input style={theme.input} type="email" name="email" placeholder="email@kamu.com" value={formData.email} onChange={handleChange} required />
        </div>

        <div style={theme.formGroup}>
          <label style={theme.label}>Jenis Commission</label>
          {loadingData ? (
            <div style={{ ...theme.input, color: '#aaa' }}>Memuat pilihan...</div>
          ) : (
            <select style={theme.input} name="type" value={formData.type} onChange={handleChange} required>
              <option value="">-- Pilih jenis --</option>
              {commissions.map((c) =>
                (c.commission_variants || []).map((v) => (
                  <option key={v.id} value={`${c.type} — ${v.label}`}>
                    {c.type} — {v.label} · Rp {Number(v.price).toLocaleString('id-ID')}
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        {/* Add-ons */}
        {addons.length > 0 && (
          <div style={theme.formGroup}>
            <label style={theme.label}>Add-ons (opsional)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {addons.map((addon) => (
                <label key={addon.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(addon.id)}
                    onChange={(e) => {
                      setSelectedAddons((prev) =>
                        e.target.checked ? [...prev, addon.id] : prev.filter((id) => id !== addon.id)
                      );
                    }}
                  />
                  <span>
                    <strong>{addon.label}</strong>
                    <span style={{ color: '#888', marginLeft: 6 }}>
                      {addon.type === 'percent' && `+${addon.value_num}% per karakter`}
                      {addon.type === 'range' && `+Rp ${Number(addon.value_min).toLocaleString('id-ID')} – ${Number(addon.value_max).toLocaleString('id-ID')}`}
                      {addon.type === 'multiplier' && `×${addon.value_num} total harga`}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Estimasi harga */}
        {formData.type && (() => {
          const est = hitungEstimasi();
          return est ? (
            <div style={{ background: isDark ? '#1e2a3a' : '#eef2ff', borderRadius: 10, padding: '12px 16px', fontSize: 14, marginBottom: 8 }}>
              💰 <strong>Estimasi: </strong>
              {est.min === est.max
                ? `Rp ${est.min.toLocaleString('id-ID')}`
                : `Rp ${est.min.toLocaleString('id-ID')} – ${est.max.toLocaleString('id-ID')}`}
              <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>*Harga final dikonfirmasi setelah diskusi</div>
            </div>
          ) : null;
        })()}

        <div style={theme.formGroup}>
          <label style={theme.label}>Deskripsi Karakter & Request</label>
          <textarea style={{ ...theme.input, height: 120, resize: 'vertical' }} name="desc" placeholder="Ceritakan karaktermu: tampilan, warna rambut, kostum, ekspresi yang diinginkan..." value={formData.desc} onChange={handleChange} required />
        </div>

        <div style={theme.formGroup}>
          <label style={theme.label}>Link Referensi (opsional)</label>
          <input style={theme.input} type="text" name="ref" placeholder="Link gambar referensi / Pinterest / dll..." value={formData.ref} onChange={handleChange} />
        </div>

        <button type="submit" style={theme.btnPrimary}>Kirim Order 🚀</button>
      </form>
    </div>
  );
}
