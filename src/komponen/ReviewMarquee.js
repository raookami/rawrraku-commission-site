import { useEffect, useState } from 'react';
import { supabase } from '../supabase'; // ← berubah, tambah ../
import ReactFastMarquee from 'react-fast-marquee';
const Marquee = ReactFastMarquee.default ?? ReactFastMarquee;

function StarDisplay({ rating }) {
  return (
    <span style={{ color: '#f5a623', fontSize: 13 }}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  );
}

function ReviewCard({ review, isDark }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
        borderRadius: 20,
        padding: '6px 14px',
        whiteSpace: 'nowrap',
        fontSize: 13,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: '#5e81d1',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {review.name.charAt(0).toUpperCase()}
      </div>
      <span style={{ fontWeight: 600, color: isDark ? '#ddd' : '#333' }}>
        {review.name}
      </span>
      <StarDisplay rating={review.rating} />
      <span
        style={{
          color: isDark ? '#aaa' : '#666',
          maxWidth: 200,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        "{review.comment}"
      </span>
    </div>
  );
}

export default function ReviewMarquee({ isDark, onClickReviews }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (data && data.length > 0) setReviews(data);
    }
    fetchReviews();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <div
      onClick={onClickReviews}
      style={{
        overflow: 'hidden',
        width: 'calc(100% + 40px)',
        marginLeft: '-20px',
        marginRight: '-20px',
        background: isDark ? 'rgba(94,129,209,0.08)' : 'rgba(94,129,209,0.07)',
        padding: '10px 0',
        marginBottom: 16,
        position: 'relative',
        display: 'flex',
        cursor: 'pointer',
      }}
    >
      {/* Fade kiri + label */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: isDark
            ? 'linear-gradient(to right, #0d1424 50%, transparent)'
            : 'linear-gradient(to right, #e8f0fc 50%, transparent)',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 12,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#5e81d1',
            whiteSpace: 'nowrap',
          }}
        >
          ⭐ ULASAN
        </span>
      </div>

      {/* Fade kanan */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 60,
          background: isDark
            ? 'linear-gradient(to left, #0d1424 50%, transparent)'
            : 'linear-gradient(to left, #e8f0fc 50%, transparent)',
          zIndex: 2,
        }}
      />

      {/* Satu track panjang: isi review dikali 4 biar seamless di semua ukuran layar */}
      <Marquee speed={40} pauseOnHover gradient={false}>
        {reviews.map((review, i) => (
          <div key={i} style={{ marginRight: 16 }}>
            <ReviewCard review={review} isDark={isDark} />
          </div>
        ))}
      </Marquee>
    </div>
  );
}
