// src/components/AdminPanel.jsx
// Panel admin untuk approve/hapus ulasan

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function StarDisplay({ rating }) {
  return (
    <span style={{ color: '#f5a623' }}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function AdminPanel({ theme, isDark }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchReviews('pending');
  }, []);

  async function fetchReviews(status) {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    setReviews(data || []);
    setLoading(false);
  }

  async function approve(id) {
    const { error } = await supabase
      .from('reviews')
      .update({ status: 'approved' })
      .eq('id', id);
    if (error) { alert('Gagal approve: ' + error.message); return; }
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  async function reject(id) {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) { alert('Gagal hapus: ' + error.message); return; }
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  function switchFilter(f) {
    setFilter(f);
    fetchReviews(f);
  }

  function handleLogout() {
    localStorage.removeItem('visitor_name');
    localStorage.removeItem('is_admin');
    window.location.href = '/';
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <h2 style={{ ...theme.sectionTitle, margin: 0 }}>🛡️ Manage Ulasan</h2>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid #e05',
            color: '#e05',
            borderRadius: 8,
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Logout
        </button>
      </div>

      {/* Filter tab */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { key: 'pending', label: '⏳ Pending' },
          { key: 'approved', label: '✅ Approved' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => switchFilter(key)}
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              border: '1.5px solid #5e81d1',
              background: filter === key ? '#5e81d1' : 'transparent',
              color: filter === key ? 'white' : '#5e81d1',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List ulasan */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>Loading...</div>
      ) : reviews.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 40,
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
            borderRadius: 16,
            color: isDark ? '#aaa' : '#999',
          }}
        >
          {filter === 'pending' ? '🎉 Tidak ada ulasan pending!' : '📭 Belum ada ulasan approved.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)',
                border: isDark ? '1px solid #333' : '1px solid #e8e0f0',
                borderRadius: 14,
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: '#5e81d1', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 15,
                    }}
                  >
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: isDark ? '#eee' : '#333' }}>
                      {review.name}
                    </div>
                    <StarDisplay rating={review.rating} />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#aaa' }}>
                  {new Date(review.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </div>
              </div>

              <p style={{ fontSize: 14, color: isDark ? '#ccc' : '#555', margin: 0, lineHeight: 1.5 }}>
                "{review.comment}"
              </p>

              {filter === 'pending' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    onClick={() => approve(review.id)}
                    style={{
                      flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                      background: '#5ed182', color: 'white', fontWeight: 700,
                      cursor: 'pointer', fontSize: 13,
                    }}
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => reject(review.id)}
                    style={{
                      flex: 1, padding: '8px', borderRadius: 8, border: 'none',
                      background: '#e05555', color: 'white', fontWeight: 700,
                      cursor: 'pointer', fontSize: 13,
                    }}
                  >
                    🗑️ Hapus
                  </button>
                </div>
              )}

              {filter === 'approved' && (
                <button
                  onClick={() => reject(review.id)}
                  style={{
                    padding: '8px', borderRadius: 8, border: 'none',
                    background: '#e05555', color: 'white', fontWeight: 700,
                    cursor: 'pointer', fontSize: 13, marginTop: 4,
                  }}
                >
                  🗑️ Hapus Ulasan Ini
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
