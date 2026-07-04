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
          className={`star-btn ${star <= (hovered || value) ? 'star-active' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ReviewForm({ visitorName }) {
  const [form, setForm] = useState({ name: visitorName || '', rating: 0, comment: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.rating === 0) { setError('Pilih rating bintang dulu ya!'); return; }
    setError('');
    setLoading(true);
    const { error: err } = await supabase.from('reviews').insert([
      { name: form.name, rating: form.rating, comment: form.comment, status: 'pending' },
    ]);
    setLoading(false);
    if (err) setError('Gagal kirim ulasan, coba lagi ya!');
    else setDone(true);
  }

  if (done) return (
    <div className="review-card" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🎉</div>
      <h3 className="review-done-title">Makasih ulasannya!</h3>
      <p className="review-done-desc">Ulasanmu lagi direview dulu ya, sebentar lagi muncul!</p>
    </div>
  );

  return (
    <div className="review-card">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div className="form-group">
          <label className="form-label">Nama / Username</label>
          <input
            className="form-input"
            type="text"
            placeholder="Nama kamu..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Rating</label>
          <StarPicker value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
        </div>

        <div className="form-group">
          <label className="form-label">Ulasan</label>
          <textarea
            className="form-input form-textarea"
            style={{ height: 90 }}
            placeholder="Ceritain pengalaman order kamu..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            required
            maxLength={300}
          />
          <div className="char-count">{form.comment.length}/300</div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="btn-primary" disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Mengirim...' : 'Kirim ulasan →'}
        </button>
      </form>
    </div>
  );
}
