import { useState } from 'react';
import { supabase } from '../supabase';

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 26,
            cursor: 'pointer',
            padding: '2px',
            lineHeight: 1,
            color: star <= (hovered || value) ? '#f5a623' : '#888',
            transition: 'color 0.1s',
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewForm({ theme, isDark, visitorName }) {
  const [form, setForm] = useState({ name: visitorName || '', rating: 0, comment: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.rating === 0) {
      setError('Pilih rating bintang dulu ya!');
      return;
    }
    setError('');
    setLoading(true);
    const { error: err } = await supabase.from('reviews').insert([
      {
        name: form.name,
        rating: form.rating,
        comment: form.comment,
        status: 'pending',
      },
    ]);
    setLoading(false);
    if (err) setError('Gagal kirim ulasan, coba lagi ya!');
    else setDone(true);
  }

  const card = {
    background: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
    border: isDark ? '0.5px solid #333' : '0.5px solid #e0e0e0',
    borderRadius: 12,
    padding: '1.5rem',
  };

  const input = {
    ...theme.input,
    transition: 'border-color 0.15s',
  };

  if (done)
    return (
      <div
        style={{
          ...card,
          textAlign: 'center',
          padding: '2.5rem 1rem',
          marginTop: 8,
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: '#5ed182',
            marginBottom: 6,
          }}
        >
          Makasih ulasannya!
        </h3>
        <p style={{ fontSize: 13, color: isDark ? '#aaa' : '#888' }}>
          Ulasanmu lagi direview dulu ya, sebentar lagi muncul!
        </p>
      </div>
    );

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={card}>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 500,
            marginBottom: 4,
            color: isDark ? '#eee' : '#222',
          }}
        >
          Tulis ulasan
        </h2>
        <p
          style={{
            fontSize: 13,
            color: isDark ? '#aaa' : '#888',
            marginBottom: '1.5rem',
          }}
        >
          Pernah order? Ceritain pengalaman kamu!
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div style={theme.formGroup}>
            <label style={theme.label}>Nama / Username</label>
            <input
              style={input}
              type="text"
              placeholder="Nama kamu..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              maxLength={50}
            />
          </div>

          <div style={theme.formGroup}>
            <label style={theme.label}>Rating</label>
            <StarPicker
              value={form.rating}
              onChange={(r) => setForm({ ...form, rating: r })}
            />
          </div>

          <div style={theme.formGroup}>
            <label style={theme.label}>Ulasan</label>
            <textarea
              style={{ ...input, height: 90, resize: 'vertical' }}
              placeholder="Ceritain pengalaman order kamu..."
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              required
              maxLength={300}
            />
            <div
              style={{
                fontSize: 11,
                color: '#aaa',
                textAlign: 'right',
                marginTop: 2,
              }}
            >
              {form.comment.length}/300
            </div>
          </div>

          {error && <div style={{ fontSize: 13, color: '#e05' }}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...theme.btnPrimary,
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {loading ? 'Mengirim...' : 'Kirim ulasan →'}
          </button>
        </form>
      </div>
    </div>
  );
}
