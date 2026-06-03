import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

function StarDisplay({ rating }) {
  return (
    <span style={{ color: '#f5a623', fontSize: 14 }}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function ReviewList({ isDark }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (data) setReviews(data);
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading)
    return (
      <p
        style={{
          fontSize: 13,
          color: isDark ? '#aaa' : '#888',
          marginBottom: 16,
        }}
      >
        Memuat ulasan...
      </p>
    );

  if (reviews.length === 0)
    return (
      <p
        style={{
          fontSize: 13,
          color: isDark ? '#aaa' : '#888',
          marginBottom: 16,
        }}
      >
        Belum ada ulasan.
      </p>
    );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginBottom: 24,
      }}
    >
      {reviews.map((r) => (
        <div
          key={r.id}
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
            border: isDark ? '0.5px solid #333' : '0.5px solid #e0e0e0',
            borderRadius: 12,
            padding: '14px 16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: '#5e81d1',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {r.name.charAt(0).toUpperCase()}
            </div>
            <span
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: isDark ? '#ddd' : '#222',
              }}
            >
              {r.name}
            </span>
            <StarDisplay rating={r.rating} />
          </div>
          <p
            style={{
              fontSize: 13,
              color: isDark ? '#bbb' : '#555',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            "{r.comment}"
          </p>
        </div>
      ))}
    </div>
  );
}
