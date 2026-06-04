import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const addons = [
  { id: 'extra_char', label: 'Extra Character', type: 'percent', value: 50 },
  {
    id: 'detailed_bg',
    label: 'Detailed BG',
    type: 'range',
    min: 50000,
    max: 100000,
  },
  { id: 'commercial', label: 'Commercial Use', type: 'multiplier', value: 2 },
  { id: 'psd', label: 'PSD File', type: 'percent', value: 90 },
];

const commissions = [
  {
    type: 'Bust Up',
    variant: [
      { label: 'Simple BG', price: 100000 },
      { label: 'Normal BG', price: 130000 },
    ],
  },
  {
    type: 'Half Body',
    variant: [
      { label: 'Simple BG', price: 200000 },
      { label: 'Normal BG', price: 250000 },
    ],
  },
  {
    type: 'Full Body',
    variant: [
      { label: 'Simple BG', price: 300000 },
      { label: 'Normal BG', price: 380000 },
    ],
  },
];

export default function Order({ isDark, theme, visitorName }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function hitungEstimasi() {
    const selected = commissions
      .flatMap((c) => c.variant.map((v) => ({ ...v, type: c.type })))
      .find((v) => `${v.type} — ${v.label}` === formData.type);

    if (!selected) return null;

    let minTotal = selected.price;
    let maxTotal = selected.price;

    selectedAddons.forEach((id) => {
      const addon = addons.find((a) => a.id === id);
      if (!addon) return;
      if (addon.type === 'percent') {
        minTotal += (selected.price * addon.value) / 100;
        maxTotal += (selected.price * addon.value) / 100;
      } else if (addon.type === 'range') {
        minTotal += addon.min;
        maxTotal += addon.max;
      } else if (addon.type === 'multiplier') {
        minTotal *= addon.value;
        maxTotal *= addon.value;
      } else if (addon.type === 'fixed') {
        minTotal += addon.value;
        maxTotal += addon.value;
      }
    });

    return { min: minTotal, max: maxTotal };
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      alert('Webhook tidak dikonfigurasi!');
      return;
    }
    const pesan = `
🎨 **ORDER BARU!**
👤 **Nama:** ${formData.name}
📱 **Kontak Diskusi:** ${formData.contact}
📧 **Email:** ${formData.email}
🖌️ **Jenis:** ${formData.type}
✨ **Add-ons:** ${selectedAddons.length > 0 ? selectedAddons.map((id) => addons.find((a) => a.id === id)?.label).join(', ') : 'Tidak ada'}
📝 **Deskripsi:** ${formData.desc}
🔗 **Referensi:** ${formData.ref || 'Tidak ada'}
`;

    try {
      await fetch(webhookUrl, {
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '12px 0',
            }}
          >
            <img
              src="/Animation5.gif"
              alt=""
              style={{ width: 160, height: 'auto' }}
            />
          </div>
          <button
            style={theme.btnPrimary}
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: '',
                contact: '',
                email: '',
                type: '',
                desc: '',
                ref: '',
              });
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
          <input
            style={theme.input}
            type="text"
            name="name"
            placeholder="Nama kamu..."
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={theme.formGroup}>
          <label style={theme.label}>Kontak Diskusi</label>
          <input
            style={theme.input}
            type="text"
            name="contact"
            placeholder="Discord / Instagram / Twitter..."
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>

        <div style={theme.formGroup}>
          <label style={theme.label}>Email</label>
          <input
            style={theme.input}
            type="email"
            name="email"
            placeholder="email@kamu.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={theme.formGroup}>
          <label style={theme.label}>Jenis Commission</label>
          <select
            style={theme.input}
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">-- Pilih jenis --</option>
            {commissions.map((c) =>
              c.variant.map((v) => (
                <option
                  key={`${c.type}-${v.label}`}
                  value={`${c.type} — ${v.label}`}
                >
                  {c.type} — {v.label} · Rp {v.price.toLocaleString('id-ID')}
                </option>
              )),
            )}
          </select>
        </div>

        {/* Add-ons */}
        <div style={theme.formGroup}>
          <label style={theme.label}>Add-ons (opsional)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {addons.map((addon) => (
              <label
                key={addon.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedAddons.includes(addon.id)}
                  onChange={(e) => {
                    setSelectedAddons((prev) =>
                      e.target.checked
                        ? [...prev, addon.id]
                        : prev.filter((id) => id !== addon.id),
                    );
                  }}
                />
                <span>
                  <strong>{addon.label}</strong>
                  <span style={{ color: '#888', marginLeft: 6 }}>
                    {addon.type === 'percent' &&
                      `+${addon.value}% per karakter`}
                    {addon.type === 'range' &&
                      `+Rp ${addon.min.toLocaleString('id-ID')} – ${addon.max.toLocaleString('id-ID')}`}
                    {addon.type === 'multiplier' &&
                      `×${addon.value} total harga`}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Estimasi harga */}
        {formData.type &&
          (() => {
            const est = hitungEstimasi();
            return est ? (
              <div
                style={{
                  background: isDark ? '#1e2a3a' : '#eef2ff',
                  borderRadius: 10,
                  padding: '12px 16px',
                  fontSize: 14,
                  marginBottom: 8,
                }}
              >
                💰 <strong>Estimasi: </strong>
                {est.min === est.max
                  ? `Rp ${est.min.toLocaleString('id-ID')}`
                  : `Rp ${est.min.toLocaleString('id-ID')} – ${est.max.toLocaleString('id-ID')}`}
                <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                  *Harga final dikonfirmasi setelah diskusi
                </div>
              </div>
            ) : null;
          })()}

        <div style={theme.formGroup}>
          <label style={theme.label}>Deskripsi Karakter & Request</label>
          <textarea
            style={{ ...theme.input, height: 120, resize: 'vertical' }}
            name="desc"
            placeholder="Ceritakan karaktermu: tampilan, warna rambut, kostum, ekspresi yang diinginkan..."
            value={formData.desc}
            onChange={handleChange}
            required
          />
        </div>

        <div style={theme.formGroup}>
          <label style={theme.label}>Link Referensi (opsional)</label>
          <input
            style={theme.input}
            type="text"
            name="ref"
            placeholder="Link gambar referensi / Pinterest / dll..."
            value={formData.ref}
            onChange={handleChange}
          />
        </div>

        <button type="submit" style={theme.btnPrimary}>
          Kirim Order 🚀
        </button>
      </form>
    </div>
  );
}
