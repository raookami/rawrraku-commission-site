import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Order({ visitorName }) {
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
  const response = await fetch('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: pesan }),
  });

  if (!response.ok) {
    throw new Error('Server merespons dengan error');
  }

  setSubmitted(true);
} catch (err) {
  alert('Gagal mengirim order, coba lagi ya!');
}
  }

  if (submitted) {
    return (
      <div className="page-enter order-page">
        <div className="success-box">
          <div style={{ fontSize: 48 }}>🎉</div>
          <h3>Order berhasil dikirim!</h3>
          <p>Aku akan balas dalam 1×24 jam ya. Cek DM atau email kamu!</p>
          <img src="/Animation5transparents.gif" alt="" style={{ width: 160, height: 'auto', margin: '12px 0' }} />
          <button
            className="btn-primary"
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

  const estimasi = hitungEstimasi();

  return (
    <div className="page-enter order-page">
      <h2 className="section-title">Form Order</h2>

      <form className="order-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label className="form-label">Nama / Username</label>
          <input className="form-input" type="text" name="name" placeholder="Nama kamu..." value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Kontak Diskusi</label>
          <input className="form-input" type="text" name="contact" placeholder="Discord / Instagram / Twitter..." value={formData.contact} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" name="email" placeholder="email@kamu.com" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Jenis Commission</label>
          {loadingData ? (
            <div className="form-input" style={{ color: 'rgba(255,255,255,0.35)' }}>Memuat pilihan...</div>
          ) : (
            <select className="form-input" name="type" value={formData.type} onChange={handleChange} required>
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
          <div className="form-group">
            <label className="form-label">Add-ons (opsional)</label>
            <div className="addon-checkboxes">
              {addons.map((addon) => (
                <label key={addon.id} className="addon-checkbox-row">
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
                    <span className="addon-label">
                      {addon.type === 'percent'    && ` +${addon.value_num}% per karakter`}
                      {addon.type === 'range'      && ` +Rp ${Number(addon.value_min).toLocaleString('id-ID')} – ${Number(addon.value_max).toLocaleString('id-ID')}`}
                      {addon.type === 'multiplier' && ` ×${addon.value_num} total harga`}
                      {addon.type === 'fixed'      && ` +Rp ${Number(addon.value_num).toLocaleString('id-ID')}`}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Estimasi harga */}
        {estimasi && (
          <div className="estimasi-box">
            💰 <strong>Estimasi: </strong>
            {estimasi.min === estimasi.max
              ? `Rp ${estimasi.min.toLocaleString('id-ID')}`
              : `Rp ${estimasi.min.toLocaleString('id-ID')} – ${estimasi.max.toLocaleString('id-ID')}`}
            <div className="estimasi-note">*Harga final dikonfirmasi setelah diskusi</div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Deskripsi Karakter & Request</label>
          <textarea className="form-input form-textarea" name="desc" placeholder="Ceritakan karaktermu: tampilan, warna rambut, kostum, ekspresi yang diinginkan..." value={formData.desc} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label className="form-label">Link Referensi (opsional)</label>
          <input className="form-input" type="text" name="ref" placeholder="Link gambar referensi / Pinterest / dll..." value={formData.ref} onChange={handleChange} />
        </div>

        <button type="submit" className="btn-primary">Kirim Order 🚀</button>
      </form>
    </div>
  );
}
