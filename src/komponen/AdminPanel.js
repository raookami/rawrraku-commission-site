// src/components/AdminPanel.jsx
// Panel admin untuk approve/hapus ulasan — login pakai password

import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const ADMIN_PASSWORD = '09000'; // Sama kayak password commission status kamu

function StarDisplay({ rating }) {
  return (
    <span style={{ color: '#f5a623' }}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function AdminPanel({ theme, isDark }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('pending'); // 'pending' | 'approved'

  function handleLogin(e) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setPwError('');
      fetchReviews('pending');
    } else {
      setPwError('Password salah!');
    }
  }

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

    if (error) {
      alert('Gagal approve: ' + error.message);
      return;
    }
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  async function reject(id) {
    const { error } = await supabase.from('reviews').delete().eq('id', id);

    if (error) {
      alert('Gagal hapus: ' + error.message);
      return;
    }
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  function switchFilter(f) {
    setFilter(f);
    fetchReviews(f);
  }

  // ===== HALAMAN LOGIN =====
  if (!loggedIn) {
    return (
      <div
        style={{
          maxWidth: 360,
          margin: '40px auto',
          padding: 32,
          background: isDark
            ? 'rgba(255,255,255,0.04)'
            : 'rgba(255,255,255,0.95)',
          borderRadius: 20,
          border: isDark ? '1px solid #333' : '1px solid #e8e0f0',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>🔐</div>
        <h2 style={{ ...theme.sectionTitle, marginBottom: 4 }}>Admin Panel</h2>
        <p
          style={{
            fontSize: 13,
            color: isDark ? '#aaa' : '#888',
            marginBottom: 24,
          }}
        >
          Masukkan password untuk manage ulasan
        </p>

        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <input
            style={{
              ...theme.input,
              textAlign: 'center',
              letterSpacing: 4,
              fontSize: 18,
            }}
            type="password"
            placeholder="••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
          />
          {pwError && (
            <div style={{ color: '#e05', fontSize: 13 }}>{pwError}</div>
          )}
          <button type="submit" style={theme.btnPrimary}>
            Masuk 🚀
          </button>
        </form>
      </div>
    );
  }

  // ===== PANEL ADMIN =====
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
          onClick={() => setLoggedIn(false)}
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
        <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>
          Loading...
        </div>
      ) : reviews.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 40,
            background: isDark
              ? 'rgba(255,255,255,0.04)'
              : 'rgba(255,255,255,0.8)',
            borderRadius: 16,
            color: isDark ? '#aaa' : '#999',
          }}
        >
          {filter === 'pending'
            ? '🎉 Tidak ada ulasan pending!'
            : '📭 Belum ada ulasan approved.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                background: isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(255,255,255,0.95)',
                border: isDark ? '1px solid #333' : '1px solid #e8e0f0',
                borderRadius: 14,
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Avatar */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#5e81d1',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: 15,
                    }}
                  >
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: isDark ? '#eee' : '#333',
                      }}
                    >
                      {review.name}
                    </div>
                    <StarDisplay rating={review.rating} />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#aaa' }}>
                  {new Date(review.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>

              {/* Komentar */}
              <p
                style={{
                  fontSize: 14,
                  color: isDark ? '#ccc' : '#555',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                "{review.comment}"
              </p>

              {/* Tombol aksi */}
              {filter === 'pending' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    onClick={() => approve(review.id)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#5ed182',
                      color: 'white',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: 13,
                    }}
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => reject(review.id)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: 8,
                      border: 'none',
                      background: '#e05555',
                      color: 'white',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: 13,
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
                    padding: '8px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#e05555',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: 13,
                    marginTop: 4,
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
